'use client';

import { adQuota, DAILY_AD_LIMIT } from '@/store/ads.store';
import { getRemaining, spendOne } from '@/utils/helpers/ad-quota.helper';
import { AdTriggerType, isNativeShell, NATIVE_AD_EVENT, NativeAdEventType, requestNativeAd } from '@/utils/helpers/native-bridge.helper';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Long enough for the `+30` FloatingText to finish its 1s animation. Covering the screen the
 * instant the pet is fed would hide the only feedback the tap produces.
 */
const AD_DELAY_MS = 1100;

/** The gift button bills {@link import('./useAdReward').useAdReward} instead. */
const isUnprompted = (trigger?: AdTriggerType) => trigger === 'feed' || trigger === 'play';

/**
 * Rate-limited ads for actions the user did not ask an ad for.
 *
 * Quota is spent on confirmed impressions only: a request that finds nothing loaded costs the
 * user nothing, so a run of empty fills cannot silently eat the daily budget.
 */
export const useNativeAd = () => {
  const [quota, setQuota] = useAtom(adQuota);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleAdEvent = (event: Event) => {
      const detail = (event as CustomEvent<NativeAdEventType>).detail;
      if (detail?.type !== 'ad:shown' || !isUnprompted(detail.trigger)) return;

      setQuota(spendOne);
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

  const remaining = getRemaining(quota, DAILY_AD_LIMIT);

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
