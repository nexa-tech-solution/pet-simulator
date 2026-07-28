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

export const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    apiKeyEnv: 'GEMINI_API_KEY',
    models: ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash-lite', 'gemini-2.5-flash'],
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
    models: ['meta-llama/llama-3.3-70b-instruct:free', 'google/gemini-2.0-flash-exp:free'],
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
