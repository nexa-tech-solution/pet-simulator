import {
  LLM_PROVIDERS,
  MAX_HISTORY_MESSAGES,
  RATE_LIMIT_COOLDOWN_MS,
  STREAM_RECOVERY_TEXT,
  TIME_TO_FIRST_TOKEN_MS,
  type LLMProvider,
} from '@/utils/constants/llm.constant';
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
 * - `transient`: 5xx / network / empty stream. Move on.
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

type StreamEvent = { type: 'text'; value: string } | { type: 'error'; message: string };

/**
 * Turns a raw SSE body into text deltas. All three providers emit the OpenAI
 * chunk shape, so one parser covers the chain.
 */
async function* parseSSE(body: ReadableStream<Uint8Array>): AsyncGenerator<StreamEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      // Last element is a partial line; keep it for the next chunk.
      buffer = lines.pop() ?? '';

      for (const raw of lines) {
        const line = raw.trim();
        if (!line) continue;
        // OpenRouter sends `: OPENROUTER PROCESSING` keep-alives. Feeding those
        // to JSON.parse would throw and kill the stream.
        if (line.startsWith(':')) continue;
        if (!line.startsWith('data:')) continue;

        const payload = line.slice(5).trim();
        if (payload === '[DONE]') return;

        let chunk: {
          error?: { message?: string };
          choices?: { delta?: { content?: string }; finish_reason?: string }[];
        };
        try {
          chunk = JSON.parse(payload);
        } catch {
          continue;
        }

        // Once streaming starts the HTTP status is already 200, so mid-stream
        // failures arrive in-band instead of as a status code.
        if (chunk.error) {
          yield { type: 'error', message: chunk.error.message ?? 'stream error' };
          return;
        }
        const choice = chunk.choices?.[0];
        if (choice?.finish_reason === 'error') {
          yield { type: 'error', message: 'provider reported finish_reason=error' };
          return;
        }

        const text = choice?.delta?.content;
        if (text) yield { type: 'text', value: text };
      }
    }
  } finally {
    reader.cancel().catch(() => {});
  }
}

type OpenResult = { ok: true; first: string; events: AsyncGenerator<StreamEvent> } | { ok: false; kind: FailureKind; status: number; body: string };

/**
 * Opens a stream and pulls the first delta. Everything before that first delta
 * is still safely retryable — no bytes have reached the browser yet — so this
 * is where the fallback chain does its work.
 */
async function openStream(provider: LLMProvider, model: string, apiKey: string, messages: ChatMessage[]): Promise<OpenResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIME_TO_FIRST_TOKEN_MS);

  try {
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages, temperature: 0.8, max_tokens: 300, stream: true }),
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      const body = await response.text().catch(() => '');
      return { ok: false, kind: classify(response.status, body), status: response.status, body: body.slice(0, 300) };
    }

    const events = parseSSE(response.body);
    const first = await events.next();

    if (first.done) {
      await events.return(undefined);
      return { ok: false, kind: 'transient', status: 200, body: 'empty stream' };
    }
    if (first.value.type === 'error') {
      await events.return(undefined);
      return { ok: false, kind: 'transient', status: 200, body: first.value.message };
    }

    return { ok: true, first: first.value.value, events };
  } finally {
    // Past this point the response may stream for as long as it likes.
    clearTimeout(timer);
  }
}

function streamResponse(opened: Extract<OpenResult, { ok: true }>, providerId: string, model: string, attempts: string[], startedAt: number) {
  const encoder = new TextEncoder();
  let full = opened.first;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encoder.encode(opened.first));

      try {
        for await (const event of opened.events) {
          if (event.type === 'error') {
            console.error(`[chat] mid-stream error on ${providerId}:${model}: ${event.message}`);
            full += STREAM_RECOVERY_TEXT;
            controller.enqueue(encoder.encode(STREAM_RECOVERY_TEXT));
            break;
          }
          full += event.value;
          controller.enqueue(encoder.encode(event.value));
        }
      } catch (error) {
        console.error(`[chat] stream aborted on ${providerId}:${model}:`, error);
        full += STREAM_RECOVERY_TEXT;
        controller.enqueue(encoder.encode(STREAM_RECOVERY_TEXT));
      } finally {
        const ms = Date.now() - startedAt;
        console.log(
          `[chat] ✓ ${providerId}:${model} (${ms}ms, streamed)${attempts.length ? ` after ${attempts.length} skipped: ${attempts.join(' | ')}` : ''}`,
        );
        console.log(`[chat]   reply: ${full}`);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // Proxies that buffer would defeat streaming entirely.
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
      'X-Chat-Provider': providerId,
      'X-Chat-Model': model,
    },
  });
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
      if (until && until > Date.now()) {
        attempts.push(`${key}: cooling down`);
        continue;
      }

      try {
        const opened = await openStream(provider, model, apiKey, messages);

        if (opened.ok) {
          cooldownUntil.delete(key);
          return streamResponse(opened, provider.id, model, attempts, startedAt);
        }

        attempts.push(`${key}: ${opened.status} ${opened.kind}`);

        if (opened.kind === 'rate-limited') {
          cooldownUntil.set(key, Date.now() + RATE_LIMIT_COOLDOWN_MS);
          continue;
        }
        // A bad key fails identically on every model here — stop wasting calls.
        if (opened.kind === 'auth') break;
      } catch (error) {
        attempts.push(`${key}: ${error instanceof Error ? error.name : 'network error'}`);
      }
    }
  }

  console.error('[chat] all providers exhausted:', attempts);
  return Response.json({ error: 'All providers unavailable', attempts }, { status: 503 });
}
