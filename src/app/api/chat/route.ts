import { LLM_PROVIDERS, MAX_HISTORY_MESSAGES, RATE_LIMIT_COOLDOWN_MS, type LLMProvider } from '@/utils/constants/llm.constant';
import { SYSTEM_PROMPT } from '@/utils/constants/pet.constant';

type ChatRole = 'system' | 'user' | 'assistant';
type ChatMessage = { role: ChatRole; content: string };

type ChatRequestBody = {
  petName?: string;
  displayName?: string;
  personality?: string;
  message?: string;
  history?: { role: 'user' | 'pet'; text: string }[];
};

/** model key -> timestamp until which it is skipped after a 429. */
const cooldownUntil = new Map<string, number>();

/**
 * Why an attempt failed, which decides whether we advance to the next model or
 * abandon the provider entirely.
 *
 * - `rate-limited`: quota gone. Cool the model down, try the next one.
 * - `auth`: the key is bad/revoked. Every model on this provider will fail the
 *   same way, so skip the rest instead of burning the whole chain per message.
 * - `model`: bad or retired model id. Only this entry is affected.
 * - `transient`: 5xx / network. Move on.
 */
type FailureKind = 'rate-limited' | 'auth' | 'model' | 'transient';

function classify(status: number, body: string): FailureKind {
  if (status === 429) return 'rate-limited';
  if (status === 401 || status === 403) return 'auth';
  if (status === 404) return 'model';
  if (status === 400) {
    // Gemini returns 400 (not 401) for a revoked or malformed key, so the
    // status alone cannot tell a dead key from a bad model id. Wording differs
    // per provider and per endpoint — Gemini's native API says "API key not
    // valid", its OpenAI-compatible one says "Please pass a valid API key".
    return /valid api key|api key not valid|api_key_invalid|incorrect api key|invalid api key|unauthorized/i.test(body) ? 'auth' : 'model';
  }
  if (status >= 500) return 'transient';
  return 'model';
}

async function callProvider(provider: LLMProvider, model: string, apiKey: string, messages: ChatMessage[]) {
  const response = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, temperature: 0.8, max_tokens: 300 }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    const body = await response.text();
    return { ok: false as const, kind: classify(response.status, body), status: response.status, body: body.slice(0, 300) };
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  // A 200 with no content still means this model gave us nothing usable.
  if (!text) return { ok: false as const, kind: 'transient' as const, status: 200, body: 'empty completion' };

  return { ok: true as const, text };
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) return Response.json({ error: 'message is required' }, { status: 400 });

  const petName = body.petName ?? 'Pet';
  const displayName = body.displayName ?? petName;
  const nameInstruction = displayName !== petName ? `Your current name is ${displayName}. The user renamed you from ${petName}.` : '';

  const messages: ChatMessage[] = [
    { role: 'system', content: [body.personality, nameInstruction, SYSTEM_PROMPT].filter(Boolean).join('\n') },
    ...(body.history ?? [])
      .slice(-MAX_HISTORY_MESSAGES)
      .map<ChatMessage>((m) => ({ role: m.role === 'pet' ? 'assistant' : 'user', content: m.text })),
    { role: 'user', content: message },
  ];

  const startedAt = Date.now();
  const now = startedAt;
  const attempts: string[] = [];

  for (const provider of LLM_PROVIDERS) {
    const apiKey = process.env[provider.apiKeyEnv];
    if (!apiKey) {
      attempts.push(`${provider.id}: no ${provider.apiKeyEnv} configured`);
      continue;
    }

    for (const model of provider.models) {
      const key = `${provider.id}:${model}`;

      const until = cooldownUntil.get(key);
      if (until && until > now) {
        attempts.push(`${key}: cooling down`);
        continue;
      }

      try {
        const result = await callProvider(provider, model, apiKey, messages);

        if (result.ok) {
          cooldownUntil.delete(key);
          const ms = Date.now() - startedAt;
          // `attempts` holds everything that failed before this one, so it
          // doubles as the fallback trail for whichever model ended up serving.
          console.log(`[chat] ✓ ${key} (${ms}ms)${attempts.length ? ` after ${attempts.length} skipped: ${attempts.join(' | ')}` : ''}`);
          console.log(`[chat]   reply: ${result.text}`);
          return Response.json({ text: result.text, provider: provider.id, model });
        }

        attempts.push(`${key}: ${result.status} ${result.kind}`);

        if (result.kind === 'rate-limited') {
          cooldownUntil.set(key, Date.now() + RATE_LIMIT_COOLDOWN_MS);
          continue;
        }
        // A bad key fails identically on every model here — stop wasting calls.
        if (result.kind === 'auth') break;
      } catch (error) {
        attempts.push(`${key}: ${error instanceof Error ? error.name : 'network error'}`);
      }
    }
  }

  console.error('[chat] all providers exhausted:', attempts);
  return Response.json({ error: 'All providers unavailable', attempts }, { status: 503 });
}
