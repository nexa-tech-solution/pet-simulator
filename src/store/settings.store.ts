'use client';

import { DEFAULT_VOLUME } from '@/utils/constants/sounds';
import { atomWithStorage } from 'jotai/utils';

/** Persisted in localStorage so both choices survive a restart. */
export const isSoundEnabled = atomWithStorage<boolean>('isSoundEnabled', true);

/** Playback volume, 0..1. */
export const soundVolume = atomWithStorage<number>('soundVolume', DEFAULT_VOLUME);
