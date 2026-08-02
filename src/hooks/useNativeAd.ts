'use client';

import { adQuota, DAILY_AD_LIMIT } from '@/store/ads.store';
import { AdTriggerType, isNativeShell, NATIVE_AD_EVENT, NativeAdEventType, requestNativeAd } from '@/utils/helpers/native-bridge.helper';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Long enough for the `+30` FloatingText to finish its 1s animation. Covering the screen
 * the instant the pet is fed would hide the only feedback the tap produces.
 */
const AD_DELAY_MS = 1100;

/** Local calendar day as YYYY-MM-DD, so the quota rolls over at the user's own midnight. */
const getLocalDay = () => {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');

  return `${now.getFullYear()}-${month}-${day}`;
};

/**
 * Rate-limited full-screen ads, played by the native shell.
 *
 * Quota is spent on confirmed impressions only: a request that finds nothing loaded costs
 * the user nothing, so a run of empty fills cannot silently eat the daily budget.
 */
export const useNativeAd = () => {
  const [quota, setQuota] = useAtom(adQuota);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleAdEvent = (event: Event) => {
      const detail = (event as CustomEvent<NativeAdEventType>).detail;
      if (detail?.type !== 'ad:shown') return;

      setQuota((prev) => {
        const today = getLocalDay();

        return prev.day === today ? { day: today, count: prev.count + 1 } : { day: today, count: 1 };
      });
    };

    window.addEventListener(NATIVE_AD_EVENT, handleAdEvent);

    return () => window.removeEventListener(NATIVE_AD_EVENT, handleAdEvent);
  }, [setQuota]);

  // A pending ad must not fire into an unmounted tree, or after a route change.
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  /** Ads left today. A stale `day` means the stored count belongs to a previous day. */
  const remaining = quota.day === getLocalDay() ? Math.max(0, DAILY_AD_LIMIT - quota.count) : DAILY_AD_LIMIT;

  /** Queues an ad if the user has budget left. Safe to call from any handler. */
  const showAd = useCallback(
    (trigger: AdTriggerType) => {
      if (!isNativeShell() || remaining === 0) return;

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => requestNativeAd(trigger), AD_DELAY_MS);
    },
    [remaining],
  );

  return { showAd, remaining };
};
