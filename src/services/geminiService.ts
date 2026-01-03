import { SYSTEM_PROMPT } from '@/utils/constants/pet.constant';
import { PetType } from '@/utils/types/pet.type';
import { Chat, GoogleGenAI } from '@google/genai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

class PetChatService {
  private ai: GoogleGenAI;
  private chats: Map<string, Chat> = new Map();

  constructor() {
    this.ai = new GoogleGenAI({ apiKey });
  }

  private getChat(pet: PetType): Chat {
    if (!this.chats.has(pet.id)) {
      const chat = this.ai.chats.create({
        // model: 'gemini-3-flash-preview',
        model: 'gemini-2.5-flash-lite',
        config: {
          systemInstruction: pet.personality + SYSTEM_PROMPT,
          temperature: 0.8,
        },
      });
      this.chats.set(pet.id, chat);
    }
    return this.chats.get(pet.id)!;
  }

  async sendMessage(pet: PetType, message: string): Promise<string> {
    try {
      const chat = this.getChat(pet);
      const result = await chat.sendMessage({ message });
      return result.text || "Sorry, I'm too busy chasing my tail right now!";
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      return "Meow... (Translation: I'm having a little trouble thinking right now. Maybe try again later?)";
    }
  }

  resetChat(petId: string) {
    this.chats.delete(petId);
  }
}

export const petChatService = new PetChatService();
