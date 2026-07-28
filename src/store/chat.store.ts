import { MessageType } from '@/utils/types/message.type';
import { atomWithStorage } from 'jotai/utils';

/** Messages kept per pet in localStorage. Older ones fall off the back. */
export const MAX_STORED_MESSAGES = 20;

/** Persisted per-pet transcript: { [petId]: messages }. */
export const chatMessagesAtom = atomWithStorage<Record<string, MessageType[]>>('messages', {});

/**
 * FIFO window: keeps the newest MAX_STORED_MESSAGES and drops the oldest.
 * Returns the same reference when no trim is needed, so React can bail out.
 */
export const capMessages = (list: MessageType[]): MessageType[] => (list.length > MAX_STORED_MESSAGES ? list.slice(-MAX_STORED_MESSAGES) : list);
