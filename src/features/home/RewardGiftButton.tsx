'use client';

import { useAdReward } from '@/hooks/useAdReward';
import { REWARD_COINS } from '@/store/ads.store';
import { isSleeping } from '@/store/pet.store';
import { IMAGES } from '@/utils/constants/images';
import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

/**
 * Watch an ad, collect coins.
 *
 * `xl:hidden` is the "mobile and iPad only" rule: shown below 1280px, which covers phones
 * and every iPad in portrait, and hidden on a typical desktop. A width rule rather than a
 * native-shell check so the button is visible in a narrowed browser during development.
 *
 * The ad itself still needs the native shell; in a browser a tap reports "no ad" instead.
 */
export const RewardGiftButton = () => {
  const t = useTranslations('home');
  const [isSleepingAtom] = useAtom(isSleeping);
  const { watchAd, isPending, remaining } = useAdReward();

  const isSpent = remaining === 0;
  const label = isSpent ? t('adLimitReached') : t('watchAdForCoins', { coins: REWARD_COINS });

  return (
    <button
      type='button'
      onClick={watchAd}
      disabled={isPending || isSpent}
      title={label}
      aria-label={label}
      className={`relative xl:hidden bg-slate-900/5 dark:bg-white/10 backdrop-blur-md p-1.5 rounded-full flex items-center justify-center border border-white/20 transition
        ${isPending || isSpent ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}`}
    >
      <Image
        // `unoptimized` keeps the animation: Next's image optimizer flattens GIFs to a
        // single still frame.
        unoptimized
        src={IMAGES.GIFT}
        alt=''
        width={20}
        height={20}
        className='w-5 h-5 object-contain'
      />
      {!isSpent && (
        <span
          className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-pink-500 ${isPending ? 'animate-ping' : 'animate-pulse'} ${
            isSleepingAtom ? 'opacity-80' : ''
          }`}
        />
      )}
    </button>
  );
};
