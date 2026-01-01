'use client';

import { atomWithStorage } from 'jotai/utils';

export const isLightMode = atomWithStorage<boolean>('isLightMode', true);
