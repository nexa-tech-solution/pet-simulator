'use client';

import { atomWithStorage } from 'jotai/utils';

/** Full-screen ads a user may see per calendar day, counted across every trigger combined. */
export const DAILY_AD_LIMIT = 2;

export type AdQuotaType = {
  /** Local calendar day the count belongs to, as YYYY-MM-DD. Empty until the first ad runs. */
  day: string;
  count: number;
};

/**
 * `getOnInit` matters here. Without it the atom starts at the default and only syncs from
 * localStorage in a mount effect, so a tap in that window would read a full budget and
 * hand out an extra ad. Reading at init is SSR-safe: jotai's storage returns the default
 * when `window` is missing. Nothing derived from this atom is rendered, so there is no
 * hydration mismatch to worry about.
 */
export const adQuota = atomWithStorage<AdQuotaType>('adQuota', { day: '', count: 0 }, undefined, { getOnInit: true });
