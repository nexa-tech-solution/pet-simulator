import { MessageType } from '@/utils/types/message.type';
import { PetType } from '@/utils/types/pet.type';

/**
 * Thin client for /api/chat. All model selection, provider fallback and API
 * keys live on the server — nothing secret reaches the browser.
 *
 * The server route is stateless, so conversation history travels with each
 * request. ChatSection already owns that history, which keeps a single source
 * of truth instead of mirroring it here.
 */
class PetChatService {
  async sendMessage(pet: PetType, message: string, displayName = pet.name, history: MessageType[] = []): Promise<string> {
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

      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        console.error('Chat request failed:', response.status, detail);
        return "Meow... (Translation: I'm having a little trouble thinking right now. Maybe try again later?)";
      }

      const data = await response.json();
      console.log(`[chat] ${data.provider}/${data.model} →`, data.text);
      return data.text || "Sorry, I'm too busy chasing my tail right now!";
    } catch (error) {
      console.error('Chat request failed:', error);
      return "Meow... (Translation: I'm having a little trouble thinking right now. Maybe try again later?)";
    }
  }
}

export const petChatService = new PetChatService();
