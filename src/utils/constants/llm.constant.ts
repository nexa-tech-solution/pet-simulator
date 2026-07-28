/**
 * Fallback chain for pet chat.
 *
 * Gemini quotas are tracked PER MODEL, so exhausting one flash-lite model leaves
 * the next one's quota intact — that is what makes the model-level fallback work.
 * They are NOT per key: extra keys from the same Google Cloud project share one
 * quota, so adding keys buys nothing. Once every Gemini model is exhausted we
 * cross to a different provider, which has a genuinely separate quota.
 *
 * All three providers speak the OpenAI /chat/completions shape, so one request
 * builder covers the whole chain.
 */

export type LLMProviderId = 'gemini' | 'groq' | 'openrouter';

export type LLMProvider = {
  id: LLMProviderId;
  baseUrl: string;
  /** Name of the server-only env var holding this provider's key. */
  apiKeyEnv: string;
  /** Tried in order; each entry has its own quota bucket. */
  models: string[];
};

/**
 * Every id below was probed against the live APIs, not taken from docs — the
 * docs still list `gemini-2.5-flash-lite` / `gemini-2.5-flash`, but both now
 * 404 with "no longer available". Re-probe before adding entries.
 *
 * Prefer explicit versioned ids over `-latest` aliases: an alias resolves to a
 * versioned model and therefore shares its quota bucket, so it adds a retry
 * without adding headroom. Lite variants come first (cheapest, largest free
 * allowance), then the fuller model.
 */
export const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    apiKeyEnv: 'GEMINI_API_KEY',
    models: ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.6-flash'],
  },
  {
    id: 'groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKeyEnv: 'GROQ_API_KEY',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
  },
  {
    id: 'openrouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    models: ['google/gemma-4-31b-it:free', 'openai/gpt-oss-20b:free'],
  },
];

/**
 * How long to skip a model after it returns 429. Without this, every request
 * retries the exhausted model first, wasting a round-trip and pushing the
 * rate limit further out. Module-level state, so it is per serverless
 * instance — a best-effort optimisation, not a correctness guarantee.
 */
export const RATE_LIMIT_COOLDOWN_MS = 60_000;

/** Cap on history turns sent upstream, to bound token spend per request. */
export const MAX_HISTORY_MESSAGES = 20;

/**
 * Budget for the *first* token only, not the whole response — a long reply must
 * not be aborted mid-sentence. Cleared as soon as the first delta lands, after
 * which the stream may run as long as it needs.
 */
export const TIME_TO_FIRST_TOKEN_MS = 15_000;

/**
 * Appended when a stream dies after we have already flushed tokens. At that
 * point the headers are sent and the user is watching text appear, so we can
 * neither rewind nor retry on another model without producing an incoherent
 * reply — recovering in character is the least-bad option.
 */
export const STREAM_RECOVERY_TEXT = ' ...meow? (Sorry, I got distracted — ask me again?)';
