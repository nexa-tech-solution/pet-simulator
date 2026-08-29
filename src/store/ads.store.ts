'use client';

import { AdQuotaType } from '@/utils/helpers/ad-quota.helper';
import { atomWithStorage } from 'jotai/utils';

/**
 * Unprompted ads (feed / play) per day.
 *
 * One. The user tapped Play to play, not to watch an ad, so this is the most that can be
 * taken before the interruption stops being a fair trade - every tap after the first opens
 * the game straight away.
 */
export const DAILY_AD_LIMIT = 1;

/**
 * Opt-in reward ads per day, budgeted separately from {@link DAILY_AD_LIMIT}.
 *
 * Sharing one budget would mean two taps of Feed leave the gift button dead for the rest of
 * the day, which is not how a button the user deliberately presses should behave. This cap
 * exists to keep the coin economy and AdMob request volume sane, not to limit annoyance.
 */
export const DAILY_REWARD_LIMIT = 5;

/** Coins paid out for watching a reward ad. */
export const REWARD_COINS = 200;

/**
 * `getOnInit` matters here. Without it an atom starts at its default and only syncs from
 * localStorage in a mount effect, so a tap in that window would read a full budget and hand
 * out an extra ad. Reading at init is SSR-safe: jotai's storage returns the default when
 * `window` is missing. Nothing derived from these atoms is server-rendered, so there is no
 * hydration mismatch to worry about.
 */
const withInitialRead = { getOnInit: true };

const emptyQuota: AdQuotaType = { day: '', count: 0 };

export const adQuota = atomWithStorage<AdQuotaType>('adQuota', emptyQuota, undefined, withInitialRead);

export const rewardQuota = atomWithStorage<AdQuotaType>('rewardQuota', emptyQuota, undefined, withInitialRead);
