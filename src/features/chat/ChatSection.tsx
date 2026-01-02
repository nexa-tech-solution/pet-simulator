'use client';

import { currentPet } from '@/store/pet.store';
import { PETS } from '@/utils/constants/pet.constant';
import { MessageType } from '@/utils/types/message.type';
import Rive from '@rive-app/react-canvas';
import { useAtom } from 'jotai';
import Lottie from 'lottie-react';
import { Send } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export const ChatSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // STORE
  const [currentPetAtom] = useAtom(currentPet);

  // STATE
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messagesMap, setMessagesMap] = useState<Record<string, MessageType[]>>(() => {
    // Initialize with greetings
    const initial: Record<string, MessageType[]> = {};
    PETS?.entries().forEach(([id, pet]) => {
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

  // EFFECT
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      // onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className='w-[90%] max-w-4xl self-center flex flex-col h-full bg-white rounded-t-3xl shadow-xl overflow-hidden border border-gray-100'>
      {/* Header */}
      <div className={`p-4 flex items-center gap-4 bg-blue-100 border-blue-300 text-blue-800 border-b`}>
        {pet?.wakeup?.imageType === 'rive' ? (
          <Rive
            src={pet.wakeup.imageUrl}
            stateMachines={pet.wakeup.stateMachines}
            className='w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm'
            key={currentPetAtom}
          />
        ) : (
          <Lottie animationData={pet?.wakeup?.imageUrl} className='w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm' />
        )}
        <div>
          <h2 className='font-bold text-xl'>{pet.name}</h2>
          <p className='text-xs opacity-80'>{isTyping ? 'Thinking...' : 'Always happy to talk!'}</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50'>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`relative max-w-[80%] p-4 rounded-2xl shadow-sm text-sm md:text-base ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white rounded-tr-none chat-bubble-user'
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 chat-bubble-pet'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className='flex justify-start'>
            <div className='bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1'>
              <span className='w-2 h-2 bg-gray-300 rounded-full animate-bounce'></span>
              <span className='w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75'></span>
              <span className='w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150'></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className='p-4 bg-white border-t border-gray-100 flex gap-2'>
        <input
          type='text'
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Talk to ${pet.name}...`}
          className='flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base transition-all'
        />
        <button
          type='submit'
          disabled={!inputText.trim() || isTyping}
          className='bg-blue-500 cursor-pointer hover:bg-blue-600 disabled:opacity-50 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-md'
        >
          {/* <i className='fas fa-paper-plane'></i> */}
          <Send />
        </button>
      </form>
    </div>
  );
};
