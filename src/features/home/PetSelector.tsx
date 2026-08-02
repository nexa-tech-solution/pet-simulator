'use client';

import { useTranslations } from 'next-intl';
import { usePetSound } from '@/hooks/usePetSound';
import { currentPet, customPets, petProfiles } from '@/store/pet.store';
import { PETS } from '@/utils/constants/pet.constant';
import { getPetDisplayName, getPetProfile, isBuiltInPetId } from '@/utils/helpers/pet.helper';
import { PetIdType, PetType } from '@/utils/types/pet.type';
import Rive from '@rive-app/react-canvas';
import { useAtom } from 'jotai';
import Lottie from 'lottie-react';
import { Cat } from 'lucide-react';
import { useMemo } from 'react';

export const PetSelector = () => {
  const t = useTranslations('home');
  const { play } = usePetSound();
  const [currentPetAtom, setCurrentPetAtom] = useAtom(currentPet);
  const [customPetsAtom] = useAtom(customPets);
  const [petProfilesAtom] = useAtom(petProfiles);

  const pets = useMemo<[PetIdType, PetType][]>(
    () => [
      ...Array.from(PETS.entries()),
      ...Object.values(customPetsAtom).map<[PetIdType, PetType]>((pet) => [
        pet.id,
        {
          id: pet.id,
          name: pet.name,
          wakeup: {
            imageUrl: pet.imageUrl,
            imageType: 'image',
          },
        },
      ]),
    ],
    [customPetsAtom],
  );

  return (
    <div className='bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 p-4'>
      <h3 className='font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2'>
        <Cat size={18} className='text-indigo-500' /> {t('chooseCompanion')}
      </h3>
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2'>
        {pets?.map(([petId, pet]) => {
          const profile = getPetProfile(petProfilesAtom, petId);
          const displayName = getPetDisplayName(pet, profile);
          const isBuiltInPet = isBuiltInPetId(petId);

          return (
            <button
              key={petId}
              // onPointerDown={forceTap(() => setCurrentPetAtom(petEnum))}

              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentPetAtom(petId);
                // Preview the pet being picked, not the one still in the store.
                play(petId);
              }}
              className={`touch-pan-y cursor-pointer flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${currentPetAtom === petId ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300' : 'border-transparent bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400'}`}
            >
              {!isBuiltInPet && pet.wakeup?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pet.wakeup.imageUrl}
                  alt={displayName}
                  className='w-20 h-20 md:w-30 md:h-30 lg:w-30 lg:h-30 rounded-2xl object-cover pointer-events-none'
                />
              ) : pet?.wakeup?.imageType === 'rive' ? (
                <Rive
                  src={pet.wakeup.imageUrl}
                  stateMachines={pet.wakeup.stateMachines}
                  className='w-20 h-20 md:w-30 md:h-30 lg:w-30 lg:h-30 pointer-events-none'
                />
              ) : (
                <Lottie animationData={pet?.wakeup?.imageUrl} className='w-20 h-20 md:w-30 md:h-30 lg:w-30 lg:h-30' />
              )}
              <span className='text-[10px] font-bold uppercase mt-1 max-w-full truncate'>{displayName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
