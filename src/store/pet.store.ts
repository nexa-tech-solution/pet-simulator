'use client';

import { PET_ENUM } from '@/utils/enums/pet.enum';
import { FeedbackType, StatisticsType } from '@/utils/types/pet.type';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const currentPet = atomWithStorage<PET_ENUM>('currentPet', PET_ENUM.BLACK_CAT);

export const isSleeping = atomWithStorage<boolean>('isSleeping', false);

export const stats = atomWithStorage<StatisticsType>('stats', {
  happiness: 50,
  hunger: 50,
  energy: 50,
  coins: 0,
});

export const feedbacks = atom<FeedbackType[]>([]);
