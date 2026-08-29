'use client';

import { adQuota, DAILY_AD_LIMIT } from '@/store/ads.store';
import { getRemaining, spendOne } from '@/utils/helpers/ad-quota.helper';
import { NATIVE_AD_EVENT, NativeAdEventType } from '@/utils/helpers/native-bridge.helper';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

/**
 * The daily budget for ads the user did not ask for.
 *
 * Play is the only action that spends from it. Feed, Sleep and Chat deliberately never
 * request an ad at all - and the gift button and the food unlock are opt-in, billed to
 * {@link import('./useAdReward').useAdReward} and their own flows respectively.
 *
 * Quota is spent on confirmed impressions only: a request that finds nothing loaded costs
 * the user nothing, so a run of empty fills cannot silently eat the daily budget.
 *
 * Callers read `remaining` and skip the ad when it is zero; mounting this hook is what
 * keeps the count honest.
 */
export const useNativeAd = () => {
  const [quota, setQuota] = useAtom(adQuota);

  useEffect(() => {
    const handleAdEvent = (event: Event) => {
      const detail = (event as CustomEvent<NativeAdEventType>).detail;
      if (detail?.type !== 'ad:shown' || detail.trigger !== 'play') return;

      setQuota(spendOne);
    };

    window.addEventListener(NATIVE_AD_EVENT, handleAdEvent);

    return () => window.removeEventListener(NATIVE_AD_EVENT, handleAdEvent);
  }, [setQuota]);

  return { remaining: getRemaining(quota, DAILY_AD_LIMIT) };
};
