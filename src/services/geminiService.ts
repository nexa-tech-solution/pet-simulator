import { MessageType } from '@/utils/types/message.type';
import { PetType } from '@/utils/types/pet.type';

const FALLBACK_TEXT = "Meow... (Translation: I'm having a little trouble thinking right now. Maybe try again later?)";

/**
 * Thin client for /api/chat. All model selection, provider fallback and API
 * keys live on the server — nothing secret reaches the browser.
 *
 * The server route is stateless, so conversation history travels with each
 * request. ChatSection already owns that history, which keeps a single source
 * of truth instead of mirroring it here.
 */
class PetChatService {
  /**
   * @param onDelta called with the full text accumulated so far, each time more
   *   arrives. Not called at all if the request fails before any token.
   * @returns the complete reply, or a friendly fallback on failure.
   */
  async sendMessage(
    pet: PetType,
    message: string,
    displayName = pet.name,
    history: MessageType[] = [],
    onDelta?: (partial: string) => void,
  ): Promise<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petName: pet.name,
          displayName,
          personality: pet.personality,
          message,
          history: history.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!response.ok || !response.body) {
        const detail = await response.json().catch(() => null);
        console.error('Chat request failed:', response.status, detail);
        return FALLBACK_TEXT;
      }

      const provider = response.headers.get('X-Chat-Provider');
      const model = response.headers.get('X-Chat-Model');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        full += chunk;
        onDelta?.(full);
      }

      console.log(`[chat] ${provider}/${model} →`, full);
      return full || "Sorry, I'm too busy chasing my tail right now!";
    } catch (error) {
      console.error('Chat request failed:', error);
      return FALLBACK_TEXT;
    }
  }
}

export const petChatService = new PetChatService();
