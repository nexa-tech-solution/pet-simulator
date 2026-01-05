'use client';

import { petChatService } from '@/services/geminiService';
import { currentPet, stats } from '@/store/pet.store';
import { PETS } from '@/utils/constants/pet.constant';
import { MessageType } from '@/utils/types/message.type';
import Rive from '@rive-app/react-canvas';
import { useAtom } from 'jotai';
import Lottie from 'lottie-react';
import { Send } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const ChatSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPetAtom] = useAtom(currentPet);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [shake, setShake] = useState(false);

  const [statsAtom, setStatsAtom] = useAtom(stats);

  const [messagesMap, setMessagesMap] = useState<Record<string, MessageType[]>>(() => {
    const initial: Record<string, MessageType[]> = {};
    PETS.entries().forEach(([id, pet]) => {
      initial[id] = [
        {
          id: 'initial-' + id,
          role: 'pet',
          text: pet.greeting || 'Hello!',
          timestamp: Date.now(),
        },
      ];
    });
    return initial;
  });

  const messages = useMemo(() => messagesMap[currentPetAtom] || [], [messagesMap, currentPetAtom]);
  const pet = useMemo(() => PETS.get(currentPetAtom)!, [currentPetAtom]);
  const canChat = useMemo(() => statsAtom.coins >= 50, [statsAtom]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      const userMsg: MessageType = {
        id: Date.now().toString(),
        role: 'user',
        text,
        timestamp: Date.now(),
      };

      setMessagesMap((prev) => ({
        ...prev,
        [pet.id]: [...(prev[pet.id] || []), userMsg],
      }));

      setIsTyping(true);

      try {
        const response = await petChatService.sendMessage(pet, text);
        const petMsg: MessageType = {
          id: (Date.now() + 1).toString(),
          role: 'pet',
          text: response,
          timestamp: Date.now(),
        };

        setMessagesMap((prev) => ({
          ...prev,
          [pet.id]: [...(prev[pet.id] || []), petMsg],
        }));
      } finally {
        setIsTyping(false);
        setStatsAtom((prev) => ({
          ...prev,
          coins: prev.coins - 50,
        }));
      }
    },
    [pet],
  );

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div
      className='w-[90%] max-w-4xl self-center flex flex-col h-[60vh]
      bg-white dark:bg-zinc-900
      rounded-t-3xl shadow-xl overflow-hidden
      border border-gray-100 dark:border-zinc-800  transition-colors duration-1500 '
    >
      {/* Header */}
      <div
        className='p-4 flex items-center gap-4
        bg-blue-100 dark:bg-zinc-800
        border-b border-blue-300 dark:border-zinc-700
        text-blue-800 dark:text-zinc-100'
      >
        {pet?.wakeup?.imageType === 'rive' ? (
          <Rive
            src={pet.wakeup.imageUrl}
            stateMachines={pet.wakeup.stateMachines}
            className='w-12 h-12 rounded-full border-2 border-white shadow-sm'
            key={currentPetAtom}
          />
        ) : (
          <Lottie animationData={pet?.wakeup?.imageUrl} className='w-12 h-12 rounded-full border-2 border-white shadow-sm' />
        )}

        <div>
          <h2 className='font-bold text-xl'>{pet.name}</h2>
          <p className='text-xs opacity-80'>{isTyping ? 'Thinking...' : 'Always happy to talk!'}</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-zinc-950'>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm md:text-base
              ${
                msg.role === 'user'
                  ? 'bg-blue-500 dark:bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 border border-gray-100 dark:border-zinc-700 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className='flex justify-start'>
            <div className='bg-white dark:bg-zinc-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-zinc-700 shadow-sm flex gap-1'>
              <span className='w-2 h-2 bg-gray-300 dark:bg-zinc-500 rounded-full animate-bounce' />
              <span className='w-2 h-2 bg-gray-300 dark:bg-zinc-500 rounded-full animate-bounce delay-75' />
              <span className='w-2 h-2 bg-gray-300 dark:bg-zinc-500 rounded-full animate-bounce delay-150' />
            </div>
          </div>
        )}
      </div>

      {!canChat && (
        <div
          className='mb-2 px-4 py-2 text-xs rounded-xl
    bg-yellow-100 dark:bg-yellow-900/30
    text-yellow-700 dark:text-yellow-300 text-center'
        >
          You need at least 50 coins to chat with your pet 🪙
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className='p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex gap-2'>
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Talk to ${pet.name}...`}
          onClick={() => {
            if (!canChat) {
              setShake(true);
              setTimeout(() => setShake(false), 400);
            }
          }}
          className={`flex-1 px-4 py-3 rounded-full transition
    ${shake ? 'animate-[shake_0.4s]' : ''}
    ${!canChat ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-400'}
  `}
        />
        <button
          type='submit'
          disabled={!inputText.trim() || isTyping}
          className='bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50
            text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md transition'
        >
          <Send />
        </button>
      </form>
    </div>
  );
};
