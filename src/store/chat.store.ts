import { MessageType } from '@/utils/types/message.type';
import { atomWithStorage } from 'jotai/utils';

export const chatMessagesAtom = atomWithStorage<Record<string, MessageType[]>>('messages', {});
