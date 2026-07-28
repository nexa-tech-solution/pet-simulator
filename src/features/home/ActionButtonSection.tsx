'use client';

import { useTranslations } from 'next-intl';
import { AppActionButton } from '@/components/app-action-button/AppActionButton';
import { feedbacks, isSleeping, stats } from '@/store/pet.store';
import { useAtom } from 'jotai';
import { Gamepad2, MessageCircle, Moon, Sun, Utensils } from 'lucide-react';
import { useAppRouter } from '@/hooks/useAppRouter';

export const ActionButtonSection = () => {
  const t = useTranslations('pets');
  const router = useAppRouter();
  // STORE
  const [isSleepingAtom, setIsSleepingAtom] = useAtom(isSleeping);
  const [statsAtom, setStatsAtom] = useAtom(stats);
  const [_, setFeedbackAtom] = useAtom(feedbacks);

  // METHOD

  const addFeedback = (text: string, color: string, e: React.MouseEvent) => {
    const id = Date.now();
    const rect = e?.currentTarget?.getBoundingClientRect();
    // Fallback for touch events or mobile
    const x = rect ? Math.random() * 40 + 20 + '%' : '50%';
    const y = rect ? '40%' : '40%';

    setFeedbackAtom((prev) => [...prev, { id, text, color, x, y }]);
  };

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
      const wakeEmojis = ['☀️', '✨', '💪', '😁'];
      const randomWake = wakeEmojis[Math.floor(Math.random() * wakeEmojis.length)];
      addFeedback(`${randomWake} Full`, 'yellow', e);
    }
  };

  const handleFeed = (e: React.MouseEvent) => {
    if (isSleepingAtom) return;
    setStatsAtom((prev) => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 30),
      energy: Math.max(0, prev.energy - 5),
      coins: prev.coins + 5, // Earn 5 coins
    }));

    // Pick a random food emoji
    const foods = ['🍗', '🍖', '🥓', '🍔', '🍕', '😋', '🥕', '🥣'];
    const randomFood = foods[Math.floor(Math.random() * foods.length)];

    addFeedback(`${randomFood} +30`, 'orange', e);
    // addFeedback('+5 Coins', 'yellow', e);
    // petSpeak("Yummy! That's delicious!");
  };

  const handlePlay = (e: React.MouseEvent) => {
    if (isSleepingAtom) return;
    if (statsAtom?.energy < 20) {
      addFeedback("🥱 I'm Too Tired!", 'gray', e);
      // petSpeak("I'm too sleepy to play...");
      return;
    }
    setStatsAtom((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 25),
      hunger: Math.max(0, prev.hunger - 15),
      energy: Math.max(0, prev.energy - 20),
      // xp: prev.xp + 25,
      coins: prev.coins + 10, // Earn 10 coins
    }));
    // Pick a random toy emoji
    const toys = ['🎾', '⚽', '🧸', '✨', '🧶', '🎉', '🏆'];
    const randomToy = toys[Math.floor(Math.random() * toys.length)];

    addFeedback(`${randomToy} +25`, 'pink', e);
    // petSpeak('This is so much fun!');
  };

  return (
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
        disabled={isSleepingAtom}
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
    </div>
  );
};
