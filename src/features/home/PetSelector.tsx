'use client';

import { currentPet } from '@/store/pet.store';
import { PETS } from '@/utils/constants/pet.constant';
import Rive from '@rive-app/react-canvas';
import { useAtom } from 'jotai';
import Lottie from 'lottie-react';
import { Cat } from 'lucide-react';
import { useMemo } from 'react';

export const PetSelector = () => {
  const [currentPetAtom, setCurrentPetAtom] = useAtom(currentPet);

  const pets = useMemo(() => Array.from(PETS.entries()), []);

  const forceTap = (fn: () => void) => (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    fn();
  };

  return (
    <div className='bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 p-4'>
      <h3 className='font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2'>
        <Cat size={18} className='text-indigo-500' /> Choose Companion
      </h3>
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2'>
        {pets?.map(([petEnum, pet]) => {
          return (
            <button
              key={petEnum}
              onPointerDown={forceTap(() => setCurrentPetAtom(petEnum))}
              className={`cursor-pointer flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${currentPetAtom === petEnum ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300' : 'border-transparent bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400'}`}
            >
              {pet?.wakeup?.imageType === 'rive' ? (
                <Rive src={pet.wakeup.imageUrl} stateMachines={pet.wakeup.stateMachines} className='w-20 h-20 md:w-30 md:h-30 lg:w-30 lg:h-30' />
              ) : (
                <Lottie animationData={pet?.wakeup?.imageUrl} className='w-20 h-20 md:w-30 md:h-30 lg:w-30 lg:h-30' />
              )}
              <span className='text-[10px] font-bold uppercase mt-1'>{pet.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
