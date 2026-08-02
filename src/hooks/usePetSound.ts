'use client';

import { playSound } from '@/services/soundPlayer';
import { currentPet } from '@/store/pet.store';
import { isSoundEnabled, soundVolume } from '@/store/settings.store';
import { getPetSound } from '@/utils/helpers/pet.helper';
import { PetIdType } from '@/utils/types/pet.type';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

/**
 * The single entry point for pet sounds.
 *
 * Owns the sound preferences so no component has to remember to check them: `play` is
 * a no-op while sound is off, and always uses the user's current volume.
 */
export const usePetSound = () => {
  const [currentPetAtom] = useAtom(currentPet);
  const [soundEnabled] = useAtom(isSoundEnabled);
  const [volume] = useAtom(soundVolume);

  /** Plays a pet's clip. Defaults to the active pet; pass `petId` to preview another. */
  const play = useCallback(
    (petId: PetIdType = currentPetAtom) => {
      if (!soundEnabled) return;

      playSound(getPetSound(petId), volume);
    },
    [currentPetAtom, soundEnabled, volume],
  );

  /**
   * Plays regardless of the on/off setting, for the settings preview: the user has just
   * opted in, but that atom update has not reached this render yet.
   */
  const preview = useCallback(
    (previewVolume: number = volume) => {
      playSound(getPetSound(currentPetAtom), previewVolume);
    },
    [currentPetAtom, volume],
  );

  return { play, preview };
};
