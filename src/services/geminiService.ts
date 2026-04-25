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

  private getChat(pet: PetType, displayName: string): Chat {
    const chatKey = `${pet.id}:${displayName}:${pet.personality ?? ''}`;

    if (!this.chats.has(chatKey)) {
      const nameInstruction = displayName !== pet.name ? `Your current name is ${displayName}. The user renamed you from ${pet.name}.` : '';
      const chat = this.ai.chats.create({
        // model: 'gemini-3-flash-preview',
        //model: 'gemini-2.5-flash-lite',
        model: 'gemini-flash-lite-latest',
        config: {
          systemInstruction: [pet.personality, nameInstruction, SYSTEM_PROMPT].filter(Boolean).join('\n'),
          temperature: 0.8,
        },
      });
      this.chats.set(chatKey, chat);
    }
    return this.chats.get(chatKey)!;
  }

  async sendMessage(pet: PetType, message: string, displayName = pet.name): Promise<string> {
    try {
      const chat = this.getChat(pet, displayName);
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
