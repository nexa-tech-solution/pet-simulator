'use client';

import { useTranslations } from 'next-intl';
import { AppActionButton } from '@/components/app-action-button/AppActionButton';
import { currentPet, feedbacks, isSleeping, stats, unlockedFoodIds } from '@/store/pet.store';
import { useAtom } from 'jotai';
import { Gamepad2, MessageCircle, Moon, Sun, Utensils } from 'lucide-react';
import { useAppRouter } from '@/hooks/useAppRouter';
import { usePetSound } from '@/hooks/usePetSound';
import { GameKind, MINI_GAME_KINDS, PlayMiniGameModal } from './PlayMiniGameModal';
import { FoodPickerSheet, PetFood } from './FoodPickerSheet';
import { isNativeShell, NATIVE_AD_EVENT, NativeAdEventType, requestNativeAd } from '@/utils/helpers/native-bridge.helper';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PETS } from '@/utils/constants/pet.constant';
import { PET_ENUM } from '@/utils/enums/pet.enum';

export const ActionButtonSection = () => {
  const t = useTranslations('pets');
  const router = useAppRouter();
  const { play } = usePetSound();
  // STORE
  const [isSleepingAtom, setIsSleepingAtom] = useAtom(isSleeping);
  const [statsAtom, setStatsAtom] = useAtom(stats);
  const [currentPetAtom] = useAtom(currentPet);
  const [unlockedFoodIdsAtom, setUnlockedFoodIdsAtom] = useAtom(unlockedFoodIds);
  const [_, setFeedbackAtom] = useAtom(feedbacks);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<GameKind>();
  const [isCheckingAd, setIsCheckingAd] = useState(false);
  const [isFoodPickerOpen, setIsFoodPickerOpen] = useState(false);
  const [isUnlockingFood, setIsUnlockingFood] = useState(false);
  const playAdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const foodAdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCheckingAdRef = useRef(false);
  const pendingFoodRef = useRef<PetFood | null>(null);
  const gameQueueRef = useRef<GameKind[]>([]);
  const lastDequeuedGameRef = useRef<GameKind | null>(null);

  // METHOD

  const addFeedback = useCallback(
    (text: string, color: string, e?: React.MouseEvent) => {
      const id = Date.now();
      const rect = e?.currentTarget?.getBoundingClientRect();
      // Fallback for touch events or mobile
      const x = rect ? Math.random() * 40 + 20 + '%' : '50%';
      const y = rect ? '40%' : '40%';

      setFeedbackAtom((prev) => [...prev, { id, text, color, x, y }]);
    },
    [setFeedbackAtom],
  );

  const handleSleep = (e: React.MouseEvent) => {
    setIsSleepingAtom(!isSleepingAtom);
    if (!isSleepingAtom) {
      setStatsAtom((prev) => ({
        ...prev,
        energy: 100,
        coins: prev.coins + 15, // Earn 15 coins for sleeping well
      }));
      const sleepEmojis = ['💤', '😴', '🌙', '🌌', '🛌'];
      const randomSleep = sleepEmojis[Math.floor(Math.random() * sleepEmojis.length)];
      addFeedback(`${randomSleep} Goodnight`, 'indigo', e);
    } else {
      // The pet greets you on waking. Going to sleep stays quiet on purpose.
      play();
      const wakeEmojis = ['☀️', '✨', '💪', '😁'];
      const randomWake = wakeEmojis[Math.floor(Math.random() * wakeEmojis.length)];
      addFeedback(`${randomWake} Full`, 'yellow', e);
    }
  };

  const handleFeed = () => {
    if (isSleepingAtom) return;
    setIsFoodPickerOpen(true);
  };

  const feedPet = useCallback(
    (food: PetFood) => {
      play();
      setStatsAtom((prev) => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + food.hunger),
        energy: Math.max(0, prev.energy - 5),
        coins: prev.coins + 5, // Earn 5 coins
      }));
      addFeedback(`😋 +${food.hunger}`, 'orange');
      setIsFoodPickerOpen(false);
    },
    [addFeedback, play, setStatsAtom],
  );

  const unlockFood = useCallback(
    (food: PetFood) => {
      if (isUnlockingFood) return;
      if (!isNativeShell()) {
        setUnlockedFoodIdsAtom((previous) => (previous.includes(food.id) ? previous : [...previous, food.id]));
        return;
      }

      pendingFoodRef.current = food;
      setIsUnlockingFood(true);
      if (!requestNativeAd('food')) {
        setIsUnlockingFood(false);
        return;
      }

      foodAdTimeout.current = setTimeout(() => {
        pendingFoodRef.current = null;
        setIsUnlockingFood(false);
      }, 10_000);
    },
    [isUnlockingFood, setUnlockedFoodIdsAtom],
  );

  const awardPlay = useCallback(
    (reward: number = 10, e?: React.MouseEvent) => {
      play();
      setStatsAtom((prev) => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + 25),
        hunger: Math.max(0, prev.hunger - 15),
        energy: Math.max(0, prev.energy - 20),
        coins: prev.coins + reward,
      }));
      addFeedback('🏆 +25', 'pink', e);
    },
    [addFeedback, play, setStatsAtom],
  );

  const nextGame = useCallback(() => {
    if (gameQueueRef.current.length === 0) {
      const queue = [...MINI_GAME_KINDS];
      for (let index = queue.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [queue[index], queue[randomIndex]] = [queue[randomIndex], queue[index]];
      }
      if (queue.length > 1 && queue[0] === lastDequeuedGameRef.current) [queue[0], queue[1]] = [queue[1], queue[0]];
      gameQueueRef.current = queue;
    }

    const next = gameQueueRef.current.shift();
    if (!next) throw new Error('Mini game queue is empty');
    lastDequeuedGameRef.current = next;
    setActiveGame(next);
    return next;
  }, []);

  const openGame = useCallback(() => {
    isCheckingAdRef.current = false;
    setIsCheckingAd(false);
    nextGame();
    setIsGameOpen(true);
  }, [nextGame]);

  useEffect(() => {
    const handleAdEvent = (event: Event) => {
      const detail = (event as CustomEvent<NativeAdEventType>).detail;
      if (detail?.trigger === 'food' && pendingFoodRef.current) {
        if (foodAdTimeout.current) clearTimeout(foodAdTimeout.current);
        const food = pendingFoodRef.current;
        pendingFoodRef.current = null;
        setIsUnlockingFood(false);

        if (detail.type === 'ad:shown') {
          setUnlockedFoodIdsAtom((previous) => (previous.includes(food.id) ? previous : [...previous, food.id]));
        }
        return;
      }
      if (!isCheckingAdRef.current || detail?.trigger !== 'play') return;
      if (playAdTimeout.current) clearTimeout(playAdTimeout.current);
      isCheckingAdRef.current = false;
      setIsCheckingAd(false);
      if (detail.type === 'ad:shown') awardPlay();
      else openGame();
    };
    window.addEventListener(NATIVE_AD_EVENT, handleAdEvent);
    return () => window.removeEventListener(NATIVE_AD_EVENT, handleAdEvent);
  }, [awardPlay, openGame, setUnlockedFoodIdsAtom]);

  useEffect(
    () => () => {
      if (playAdTimeout.current) clearTimeout(playAdTimeout.current);
      if (foodAdTimeout.current) clearTimeout(foodAdTimeout.current);
    },
    [],
  );

  const handlePlay = (e: React.MouseEvent) => {
    if (isSleepingAtom) return;
    if (statsAtom?.energy < 20) {
      addFeedback("🥱 I'm Too Tired!", 'gray', e);
      // petSpeak("I'm too sleepy to play...");
      return;
    }
    if (!isNativeShell()) {
      openGame();
      return;
    }
    isCheckingAdRef.current = true;
    setIsCheckingAd(true);
    if (!requestNativeAd('play')) {
      openGame();
      return;
    }
    playAdTimeout.current = setTimeout(openGame, 10_000);
  };

  return (
    <>
      <div className='absolute right-4 top-[40%] md:top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-4 items-end animate-[fadeIn_0.5s]'>
        <AppActionButton
          isFab={true}
          onClick={handleFeed}
          icon={Utensils}
          label={t('actions.feed')}
          color='text-orange-500 bg-orange-500'
          disabled={isSleepingAtom}
        />
        <AppActionButton
          isFab={true}
          onClick={handlePlay}
          icon={Gamepad2}
          label={t('actions.play')}
          color='text-pink-500 bg-pink-500'
          disabled={isSleepingAtom || isCheckingAd}
        />
        <AppActionButton
          isFab={true}
          onClick={handleSleep}
          icon={isSleepingAtom ? Sun : Moon}
          label={isSleepingAtom ? t('actions.wakeUp') : t('actions.sleep')}
          color='text-indigo-500 bg-indigo-500'
        />
        <AppActionButton
          isFab={true}
          onClick={() => {
            router.push('/chat');
          }}
          icon={MessageCircle}
          label={t('actions.talk')}
          color='text-blue-500 bg-blue-500'
          disabled={isSleepingAtom}
        />
        {isCheckingAd && (
          <div className='rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black text-pink-600 shadow-lg dark:bg-slate-800'>
            Checking reward...
          </div>
        )}
      </div>
      {isGameOpen && activeGame && (
        <PlayMiniGameModal
          initialGame={activeGame}
          onRequestNextGame={nextGame}
          onClose={() => setIsGameOpen(false)}
          onWin={(coins) => {
            awardPlay(coins);
            setIsGameOpen(false);
          }}
        />
      )}
      {isFoodPickerOpen && (
        <FoodPickerSheet
          petId={currentPetAtom}
          petName={PETS.get(currentPetAtom as PET_ENUM)?.name ?? 'your pet'}
          unlockedFoodIds={unlockedFoodIdsAtom}
          isUnlocking={isUnlockingFood}
          onClose={() => setIsFoodPickerOpen(false)}
          onChooseFood={feedPet}
          onUnlockFood={unlockFood}
        />
      )}
    </>
  );
};
