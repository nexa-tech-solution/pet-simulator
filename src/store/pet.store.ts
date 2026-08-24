'use client';

import { PET_ENUM } from '@/utils/enums/pet.enum';
import { CustomPetsType, FeedbackType, PetIdType, PetProfilesType, StatisticsType } from '@/utils/types/pet.type';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const currentPet = atomWithStorage<PetIdType>('currentPet', PET_ENUM.BLACK_CAT);

export const isSleeping = atomWithStorage<boolean>('isSleeping', false);

export const stats = atomWithStorage<StatisticsType>('stats', {
  happiness: 50,
  hunger: 50,
  energy: 50,
  coins: 200,
});

export const petProfiles = atomWithStorage<PetProfilesType>('petProfiles', {});

export const customPets = atomWithStorage<CustomPetsType>('customPets', {});

/** Food IDs unlocked by the user, persisted locally for the progressive food menu. */
export const unlockedFoodIds = atomWithStorage<string[]>('unlockedFoodIds', []);

export const feedbacks = atom<FeedbackType[]>([]);
