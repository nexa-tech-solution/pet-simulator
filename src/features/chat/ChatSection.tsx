'use client';

import { useTranslations } from 'next-intl';
import { petChatService } from '@/services/geminiService';
import { capMessages, chatMessagesAtom } from '@/store/chat.store';
import { currentPet, customPets, petProfiles, stats } from '@/store/pet.store';
import { useAppRouter } from '@/hooks/useAppRouter';
import { CHAT_COST, PETS } from '@/utils/constants/pet.constant';
import { getCustomPetAsPet, getPetDisplayName, getPetProfile, isBuiltInPetId } from '@/utils/helpers/pet.helper';
import { MessageType } from '@/utils/types/message.type';
import Rive from '@rive-app/react-canvas';
import { useAtom } from 'jotai';
import Lottie from 'lottie-react';
import { Send, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const ChatSection = () => {
  const t = useTranslations('chat');
  const tCommon = useTranslations('common');
  const router = useAppRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPetAtom] = useAtom(currentPet);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // `isTyping` only drives the dots and stops at the first token, so it cannot
  // gate input — a reply is still streaming after it flips false.
  const [isSending, setIsSending] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [shake, setShake] = useState(false);

  const [customPetsAtom] = useAtom(customPets);
  const [petProfilesAtom] = useAtom(petProfiles);
  const [statsAtom, setStatsAtom] = useAtom(stats);

  const [messagesMap, setMessagesMap] = useAtom(chatMessagesAtom);

  const messages = useMemo(() => messagesMap[currentPetAtom] || [], [messagesMap, currentPetAtom]);
  const isBuiltInPet = useMemo(() => isBuiltInPetId(currentPetAtom), [currentPetAtom]);
  const pet = useMemo(
    () => (isBuiltInPetId(currentPetAtom) ? PETS.get(currentPetAtom)! : getCustomPetAsPet(customPetsAtom, currentPetAtom)!),
    [currentPetAtom, customPetsAtom],
  );
  const petProfile = useMemo(() => getPetProfile(petProfilesAtom, currentPetAtom), [currentPetAtom, petProfilesAtom]);
  const displayName = useMemo(() => getPetDisplayName(pet, petProfile), [pet, petProfile]);
  const customImageUrl = useMemo(() => (!isBuiltInPet && pet?.wakeup?.imageUrl ? pet.wakeup.imageUrl : ''), [isBuiltInPet, pet]);
  const canChat = useMemo(() => statsAtom.coins >= CHAT_COST, [statsAtom]);

  const rejectChat = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }, []);

  const handleSendMessage = useCallback(
    async (text: string) => {
      // Last line of defence: the button is disabled and handleSubmit checks
      // too, but nothing may spend coins the player does not have.
      if (statsAtom.coins < CHAT_COST) {
        rejectChat();
        return;
      }

      const userMsg: MessageType = {
        id: Date.now().toString(),
        role: 'user',
        text,
        timestamp: Date.now(),
      };

      setMessagesMap((prev) => ({
        ...prev,
        [pet.id]: capMessages([...(prev[pet.id] || []), userMsg]),
      }));

      setIsTyping(true);
      setIsSending(true);

      const petMsgId = `${Date.now() + 1}-pet`;

      // Upserts the streaming bubble: appends it on the first token, then
      // rewrites its text as more arrives.
      const upsertPetMessage = (value: string) =>
        setMessagesMap((prev) => {
          const list = prev[pet.id] || [];
          const last = list[list.length - 1];
          const next: MessageType[] =
            last?.id === petMsgId
              ? // Already streaming: rewrite in place, so no re-trim is needed.
                [...list.slice(0, -1), { ...last, text: value }]
              : capMessages([...list, { id: petMsgId, role: 'pet', text: value, timestamp: Date.now() }]);
          return { ...prev, [pet.id]: next };
        });

      try {
        const response = await petChatService.sendMessage(pet, text, displayName, messagesMap[pet.id] || [], (partial) => {
          // Text is on screen now, so the typing dots have done their job.
          setIsTyping(false);
          upsertPetMessage(partial);
        });

        // Nothing streamed (request failed before the first token) — show the
        // fallback text the service returned.
        upsertPetMessage(response);
      } finally {
        setIsTyping(false);
        setIsSending(false);
        setStatsAtom((prev) => ({
          ...prev,
          // Floor at 0 — an unguarded subtraction is how the balance reached -35.
          coins: Math.max(0, prev.coins - CHAT_COST),
        }));
      }
    },
    // messagesMap is read to send conversation history; without it here the
    // closure goes stale and the pet loses track of the conversation.
    [displayName, pet, setStatsAtom, setMessagesMap, messagesMap, statsAtom.coins, rejectChat],
  );

  // Seed the greeting lazily, per pet, only when that pet has no transcript.
  // Depends on `messages` so it re-seeds if atomWithStorage hydrates an empty
  // map in after the first render.
  useEffect(() => {
    if (messages.length) return;
    const greeting = isBuiltInPet ? pet?.greeting : `Hi, I'm ${pet?.name}. I'm happy to be here with you.`;
    setMessagesMap((prev) =>
      prev[currentPetAtom]?.length
        ? prev
        : {
            ...prev,
            [currentPetAtom]: [{ id: `initial-${currentPetAtom}`, role: 'pet', text: greeting || 'Hello!', timestamp: Date.now() }],
          },
    );
  }, [messages.length, currentPetAtom, isBuiltInPet, pet, setMessagesMap]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  // Deleting the key rather than storing [] keeps localStorage tidy; either way
  // the greeting-seeding effect notices the empty transcript and restores the
  // greeting.
  const handleClearChat = () => {
    setMessagesMap((prev) => {
      const next = { ...prev };
      delete next[currentPetAtom];
      return next;
    });
    setIsConfirmOpen(false);
  };

  useEffect(() => {
    if (!isConfirmOpen) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setIsConfirmOpen(false);
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isConfirmOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Catches Enter-to-submit, which bypasses the disabled button entirely.
    if (!canChat) {
      rejectChat();
      return;
    }
    if (inputText.trim()) {
      handleSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const confirmModal = isConfirmOpen && (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'
      onClick={() => setIsConfirmOpen(false)}
      role='dialog'
      aria-modal='true'
      aria-label={t('clearChatTitle')}
    >
      <div
        className='w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-2xl
          animate-[slideUp_0.25s_cubic-bezier(0.16,1,0.3,1)] flex flex-col gap-4'
        onClick={(event) => event.stopPropagation()}
      >
        <div className='flex items-start gap-3'>
          <div className='p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 shrink-0'>
            <Trash2 size={22} />
          </div>
          <div className='min-w-0'>
            <h3 className='font-black text-lg text-slate-800 dark:text-white'>{t('clearChatTitle')}</h3>
            <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>{t('clearChatMessage', { name: displayName })}</p>
          </div>
        </div>

        <div className='flex justify-end gap-2'>
          <button
            type='button'
            onClick={() => setIsConfirmOpen(false)}
            className='h-10 px-4 rounded-xl bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-white text-sm font-bold
              flex items-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-500 transition'
          >
            <X size={16} /> {tCommon('cancel')}
          </button>
          <button
            type='button'
            autoFocus
            onClick={handleClearChat}
            className='h-10 px-4 rounded-xl bg-red-500 text-white text-sm font-bold
              flex items-center gap-2 hover:bg-red-600 transition'
          >
            <Trash2 size={16} /> {tCommon('delete')}
          </button>
        </div>
      </div>
    </div>
  );

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
        {customImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={customImageUrl} alt={displayName} className='w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover' />
        ) : pet?.wakeup?.imageType === 'rive' ? (
          <Rive
            src={pet.wakeup.imageUrl}
            stateMachines={pet.wakeup.stateMachines}
            className='w-12 h-12 rounded-full border-2 border-white shadow-sm'
            key={currentPetAtom}
          />
        ) : (
          <Lottie animationData={pet?.wakeup?.imageUrl} className='w-12 h-12 rounded-full border-2 border-white shadow-sm' />
        )}

        <div className='flex-1 min-w-0'>
          <h2 className='font-bold text-xl truncate'>{displayName}</h2>
          <p className='text-xs opacity-80'>{isTyping ? t('thinking') : t('alwaysHappy')}</p>
        </div>

        <button
          type='button'
          onClick={() => setIsConfirmOpen(true)}
          disabled={isSending || messages.length === 0}
          title={t('clearChat')}
          aria-label={t('clearChat')}
          className='w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm
            bg-white/70 dark:bg-white/10 hover:bg-red-500 hover:text-white dark:hover:bg-red-500
            text-blue-700 dark:text-zinc-100
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/70 disabled:hover:text-blue-700
            transition active:scale-95'
        >
          <Trash2 size={18} />
        </button>
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
          className='mx-4 mb-2 px-4 py-3 rounded-xl
    bg-yellow-100 dark:bg-yellow-900/30
    text-yellow-800 dark:text-yellow-300
    flex flex-col items-center gap-2 text-center'
        >
          <p className='text-xs font-semibold'>{t('needCoins', { coins: CHAT_COST })} 🪙</p>
          <p className='text-[11px] opacity-90'>{t('earnCoinsHint', { name: displayName })}</p>
          <button
            type='button'
            onClick={() => router.push('/')}
            className='mt-0.5 px-4 py-1.5 rounded-full text-xs font-semibold
              bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-500
              text-yellow-950 dark:text-white shadow-sm transition active:scale-95'
          >
            {t('goEarnCoins')} 🏠
          </button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className='p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex gap-2 items-center'>
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t('placeholder', { name: displayName })}
          onClick={() => {
            if (!canChat) {
              setShake(true);
              setTimeout(() => setShake(false), 400);
            }
          }}
          className={`flex-1 min-w-0 px-4 py-3 rounded-full transition
    ${shake ? 'animate-[shake_0.4s]' : ''}
    ${!canChat ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-400'}
  `}
        />
        <button
          type='submit'
          disabled={!canChat || !inputText.trim() || isSending}
          className='bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50
            text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md transition flex-shrink-0'
        >
          <Send size={20} />
        </button>
      </form>

      {confirmModal}
    </div>
  );
};
