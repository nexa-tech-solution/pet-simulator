'use client';

import { DAILY_REWARD_LIMIT, REWARD_COINS, rewardQuota } from '@/store/ads.store';
import { stats } from '@/store/pet.store';
import { getRemaining, spendOne } from '@/utils/helpers/ad-quota.helper';
import { NATIVE_AD_EVENT, NativeAdEventType, requestNativeAd } from '@/utils/helpers/native-bridge.helper';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Releases the flow if the shell never answers. It always replies today, but a throw inside
 * its message handler would strand the modal spinning, and the shell ships as a built binary
 * that the web cannot patch.
 */
const REPLY_TIMEOUT_MS = 10_000;

/**
 * `offer` waiting on the user, `pending` waiting on the ad, then either `won` or
 * `unavailable`. The modal renders straight off this.
 */
export type AdRewardStatusType = 'offer' | 'pending' | 'won' | 'unavailable';

/**
 * The gift button: watch an ad, collect coins.
 *
 * Coins are paid only against a confirmed impression, so an empty fill costs neither coins
 * nor quota. Outside the native shell there is no ad SDK to ask, and the flow lands on
 * `unavailable` rather than hanging.
 */
export const useAdReward = () => {
  const [quota, setQuota] = useAtom(rewardQuota);
  const [, setStats] = useAtom(stats);
  const [status, setStatus] = useState<AdRewardStatusType>('offer');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearReplyTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  useEffect(() => {
    const handleAdEvent = (event: Event) => {
      const detail = (event as CustomEvent<NativeAdEventType>).detail;
      if (detail?.trigger !== 'reward') return;

      clearReplyTimeout();

      if (detail.type !== 'ad:shown') {
        setStatus('unavailable');
        return;
      }

      setQuota(spendOne);
      setStats((prev) => ({ ...prev, coins: prev.coins + REWARD_COINS }));
      setStatus('won');
    };

    window.addEventListener(NATIVE_AD_EVENT, handleAdEvent);

    return () => window.removeEventListener(NATIVE_AD_EVENT, handleAdEvent);
  }, [setQuota, setStats]);

  useEffect(() => clearReplyTimeout, []);

  const remaining = getRemaining(quota, DAILY_REWARD_LIMIT);

  const watchAd = useCallback(() => {
    if (status === 'pending' || remaining === 0) return;

    // requestNativeAd already reports whether there was anything to ask, so this does not
    // probe the host a second time.
    if (!requestNativeAd('reward')) {
      setStatus('unavailable');
      return;
    }

    setStatus('pending');
    timeoutRef.current = setTimeout(() => setStatus('unavailable'), REPLY_TIMEOUT_MS);
  }, [remaining, status]);

  /** Back to the offer, for when the modal is closed and later reopened. */
  const reset = useCallback(() => {
    clearReplyTimeout();
    setStatus('offer');
  }, []);

  return { watchAd, reset, status, remaining };
};
