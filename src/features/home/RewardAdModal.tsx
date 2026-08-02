'use client';

import { AdRewardStatusType } from '@/hooks/useAdReward';
import { REWARD_COINS } from '@/store/ads.store';
import { IMAGES } from '@/utils/constants/images';
import { Loader, Play, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type RewardAdModalProps = {
  status: AdRewardStatusType;
  onWatch: () => void;
  onClose: () => void;
};

/** Gold disc with a `$`, matching the coin already used in the header. */
const CoinIcon = ({ size = 28 }: { size?: number }) => (
  <span
    aria-hidden='true'
    className='inline-flex shrink-0 items-center justify-center rounded-full border-2 border-amber-500 bg-linear-to-b from-amber-300 to-yellow-500 font-black text-amber-900 shadow-[inset_0_-2px_4px_rgba(180,83,9,0.35)]'
    style={{ width: size, height: size, fontSize: size * 0.55 }}
  >
    $
  </span>
);

/**
 * The watch-an-ad-for-coins dialog.
 *
 * One component covers the whole flow: the offer, the wait while the ad plays, the payout,
 * and the no-fill dead end. `status` comes from useAdReward, which owns the actual bridge
 * conversation, so this file stays presentational.
 */
export const RewardAdModal = ({ status, onWatch, onClose }: RewardAdModalProps) => {
  const t = useTranslations('home.reward');
  const isWon = status === 'won';

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-label={isWon ? t('congrats') : t('title')}
      className='fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-6 backdrop-blur-sm animate-[fadeIn_0.2s]'
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className='relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800'
      >
        <button
          type='button'
          onClick={onClose}
          aria-label={t('close')}
          className='absolute right-3 top-3 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:scale-105 active:scale-95'
        >
          <X size={22} strokeWidth={3} />
        </button>

        {/* Hero: radial rays behind the gift, with confetti flecks. */}
        <div className='relative flex h-44 items-center justify-center overflow-hidden bg-linear-to-b from-sky-400 to-sky-300'>
          <div
            aria-hidden='true'
            className='absolute inset-0 opacity-60'
            style={{
              background: 'repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.55) 0deg 6deg, rgba(255,255,255,0) 6deg 18deg)',
            }}
          />
          <div aria-hidden='true' className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9),transparent_62%)]' />

          {isWon ? (
            <div className='relative z-10 flex flex-col items-center'>
              <CoinIcon size={64} />
              <div className='mt-2 flex gap-1'>
                <CoinIcon size={26} />
                <CoinIcon size={26} />
                <CoinIcon size={26} />
              </div>
            </div>
          ) : (
            <Image unoptimized src={IMAGES.GIFT} alt='' width={124} height={124} className='relative z-10 h-28 w-28 object-contain drop-shadow-xl' />
          )}
        </div>

        <div className='flex flex-col items-center gap-3 px-6 pb-6 pt-5 text-center'>
          <h2 className='text-2xl font-black text-blue-600 dark:text-blue-400'>{isWon ? t('congrats') : t('title')}</h2>

          {isWon ? (
            <p className='flex flex-wrap items-center justify-center gap-1.5 text-base font-bold text-slate-600 dark:text-slate-300'>
              {t('wonPrefix')} <CoinIcon size={22} />
              <span className='text-amber-500'>{t('wonAmount', { coins: REWARD_COINS })}</span>
            </p>
          ) : (
            <>
              <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>{t('subtitle')}</p>

              <div className='flex w-full items-center justify-center gap-3 rounded-full bg-amber-100 py-2.5 dark:bg-amber-500/15'>
                <CoinIcon size={34} />
                <span className='text-3xl font-black text-amber-700 dark:text-amber-300'>{REWARD_COINS}</span>
              </div>

              {status === 'unavailable' ? (
                <p className='py-2 text-sm font-bold text-slate-400'>😿 {t('unavailable')}</p>
              ) : (
                <button
                  type='button'
                  onClick={onWatch}
                  disabled={status === 'pending'}
                  className='mt-1 flex w-full cursor-pointer flex-col items-center rounded-full bg-blue-600 px-6 py-3 text-white shadow-[0_6px_0_rgb(29,78,216)] transition active:translate-y-1 active:shadow-[0_2px_0_rgb(29,78,216)] disabled:cursor-not-allowed disabled:opacity-60'
                >
                  <span className='flex items-center gap-2 text-lg font-black'>
                    {status === 'pending' ? <Loader size={22} className='animate-spin' /> : <Play size={20} fill='currentColor' />}
                    {status === 'pending' ? t('loading') : t('watch')}
                  </span>
                  <span className='text-xs font-medium text-blue-100'>{t('watchHint')}</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
