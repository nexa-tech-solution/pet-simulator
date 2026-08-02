'use client';

import { DAILY_REWARD_LIMIT, REWARD_COINS, rewardQuota } from '@/store/ads.store';
import { feedbacks, stats } from '@/store/pet.store';
import { getRemaining, spendOne } from '@/utils/helpers/ad-quota.helper';
import { isNativeShell, NATIVE_AD_EVENT, NativeAdEventType, requestNativeAd } from '@/utils/helpers/native-bridge.helper';
import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Releases the button if the shell never answers. It always replies today, but a throw inside
 * its message handler would strand the button disabled, and the shell ships as a built binary
 * that the web cannot patch.
 */
const REPLY_TIMEOUT_MS = 10_000;

/**
 * The gift button: watch an ad, collect coins.
 *
 * Unlike feed and play this fires with no delay -- the user pressed a button asking for the
 * ad, so anything but an immediate response reads as a dead tap. Coins are paid only against
 * a confirmed impression, so an empty fill costs neither coins nor quota.
 *
 * Outside the native shell (a plain browser, including a narrow one) there is no ad SDK to
 * ask, so a tap reports "no ad" rather than silently doing nothing.
 */
export const useAdReward = () => {
  const t = useTranslations('home');
  const [quota, setQuota] = useAtom(rewardQuota);
  const [, setStats] = useAtom(stats);
  const [, setFeedback] = useAtom(feedbacks);
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushFeedback = useCallback(
    (text: string, color: string) => {
      setFeedback((prev) => [...prev, { id: Date.now(), text, color, x: '50%', y: '40%' }]);
    },
    [setFeedback],
  );

  useEffect(() => {
    const handleAdEvent = (event: Event) => {
      const detail = (event as CustomEvent<NativeAdEventType>).detail;
      if (detail?.trigger !== 'reward') return;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsPending(false);

      if (detail.type !== 'ad:shown') {
        pushFeedback(`😿 ${t('adUnavailable')}`, 'gray');
        return;
      }

      setQuota(spendOne);
      setStats((prev) => ({ ...prev, coins: prev.coins + REWARD_COINS }));
      pushFeedback(`🪙 +${REWARD_COINS}`, 'orange');
    };

    window.addEventListener(NATIVE_AD_EVENT, handleAdEvent);

    return () => window.removeEventListener(NATIVE_AD_EVENT, handleAdEvent);
  }, [pushFeedback, setQuota, setStats, t]);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const remaining = getRemaining(quota, DAILY_REWARD_LIMIT);

  const watchAd = useCallback(() => {
    if (isPending || remaining === 0) return;

    // Checked at tap time, not render time: no shell means no ad, but it must not change
    // what the server rendered.
    if (!isNativeShell()) {
      pushFeedback(`😿 ${t('adUnavailable')}`, 'gray');
      return;
    }

    setIsPending(true);
    timeoutRef.current = setTimeout(() => setIsPending(false), REPLY_TIMEOUT_MS);
    requestNativeAd('reward');
  }, [isPending, pushFeedback, remaining, t]);

  return { watchAd, isPending, remaining };
};
