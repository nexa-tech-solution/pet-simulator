'use client';

import { useAdReward } from '@/hooks/useAdReward';
import { REWARD_COINS } from '@/store/ads.store';
import { isSleeping } from '@/store/pet.store';
import { IMAGES } from '@/utils/constants/images';
import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { RewardAdModal } from './RewardAdModal';

/**
 * Watch an ad, collect coins.
 *
 * `xl:hidden` is the "mobile and iPad only" rule: shown below 1280px, which covers phones
 * and every iPad in portrait, and hidden on a typical desktop. A width rule rather than a
 * native-shell check so the button is visible in a narrowed browser during development.
 *
 * The ad itself still needs the native shell; in a browser a tap reports "no ad" instead.
 *
 * Floats on the left edge, mirroring ActionButtonSection on the right. It self-positions the
 * same way that section does, so the page just drops it in as a sibling. Living outside the
 * header is also what gives the `+coin` badge room to overhang without hitting anything.
 */
export const RewardGiftButton = () => {
  const t = useTranslations('home');
  const [isSleepingAtom] = useAtom(isSleeping);
  const { watchAd, reset, status, remaining } = useAdReward();
  const [isOpen, setIsOpen] = useState(false);

  const isSpent = remaining === 0;
  const isPending = status === 'pending';
  const label = isSpent ? t('adLimitReached') : t('watchAdForCoins', { coins: REWARD_COINS });

  const handleOpen = () => {
    // A finished run leaves the status on `won`; rewind so the next open shows the offer.
    reset();
    setIsOpen(true);
  };

  return (
    // The modal is a sibling of the floating button, never a child. `transform` on the
    // wrapper makes it the containing block for any `position: fixed` descendant, which
    // collapsed the full-screen overlay down to the 56px button box.
    <>
      <div className='absolute left-4 top-[40%] md:top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-4 items-start animate-[fadeIn_0.5s] xl:hidden'>
        <button
          type='button'
          onClick={handleOpen}
          disabled={isSpent}
          title={label}
          aria-label={label}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full transition
        ${isSpent ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:scale-105 active:scale-95'}`}
        >
          <span
            aria-hidden='true'
            className='absolute inset-[6px] rounded-full border-[3px] border-amber-300 shadow-[0_0_0_2px_rgba(251,191,36,0.2),0_0_18px_rgba(251,191,36,0.65)]'
          />
          <span aria-hidden='true' className='absolute inset-[10px] rounded-full bg-white/95 shadow-[0_10px_24px_rgba(249,168,37,0.28)]' />
          <span
            aria-hidden='true'
            className='absolute left-1.5 top-4 h-1.5 w-1.5 rotate-45 rounded-[2px] bg-amber-200 shadow-[0_0_8px_rgba(253,224,71,0.95)]'
          />
          <span
            aria-hidden='true'
            className='absolute bottom-3 left-3 h-1 w-1 rotate-45 rounded-[2px] bg-amber-200 shadow-[0_0_8px_rgba(253,224,71,0.9)]'
          />
          <span
            aria-hidden='true'
            className='absolute bottom-2 right-3 h-1.5 w-1.5 rotate-45 rounded-[2px] bg-amber-200 shadow-[0_0_8px_rgba(253,224,71,0.95)]'
          />
          <span className='relative z-10 flex h-10 w-10 items-center justify-center rounded-full'>
            <Image src={IMAGES.GIFT} alt='' width={28} height={28} className='h-7 w-7 object-contain' />
          </span>
          {!isSpent && (
            <span
              aria-hidden='true'
              className={`absolute -right-8 -top-1 z-20 flex min-w-[54px] items-center justify-center rounded-full border-1 border-white bg-linear-to-r from-amber-300 to-yellow-400 px-2 py-0.5 text-[9px] font-black text-amber-950 shadow-[0_4px_14px_rgba(251,191,36,0.45)] ${isPending ? 'animate-pulse' : ''} ${
                isSleepingAtom ? 'opacity-80' : ''
              }`}
            >
              +{REWARD_COINS} coin
            </span>
          )}
        </button>
      </div>

      {isOpen && <RewardAdModal status={status} onWatch={watchAd} onClose={() => setIsOpen(false)} />}
    </>
  );
};
