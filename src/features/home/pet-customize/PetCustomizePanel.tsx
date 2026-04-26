'use client';

import { currentPet, customPets } from '@/store/pet.store';
import { PETS } from '@/utils/constants/pet.constant';
import { getCustomPetAsPet, isBuiltInPetId } from '@/utils/helpers/pet.helper';
import { PetType } from '@/utils/types/pet.type';
import { useAtom } from 'jotai';
import { Camera } from 'lucide-react';
import { useMemo } from 'react';
import { CreatePetForm } from './CreatePetForm';
import { SelectedPetEditor } from './SelectedPetEditor';

type PetCustomizePanelProps = {
  onCreateSuccess?: () => void;
};

export const PetCustomizePanel = ({ onCreateSuccess }: PetCustomizePanelProps) => {
  const [currentPetAtom, setCurrentPetAtom] = useAtom(currentPet);
  const [customPetsAtom, setCustomPetsAtom] = useAtom(customPets);

  const selectedPet = useMemo<PetType | null>(() => {
    if (isBuiltInPetId(currentPetAtom)) return PETS.get(currentPetAtom) ?? null;

    return getCustomPetAsPet(customPetsAtom, currentPetAtom);
  }, [currentPetAtom, customPetsAtom]);

  return (
    <div className='bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 p-4'>
      <h3 className='font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2'>
        <Camera size={18} className='text-pink-500' /> Customize Pet
      </h3>

      {selectedPet && <SelectedPetEditor key={currentPetAtom} petId={currentPetAtom} selectedPet={selectedPet} />}

      <CreatePetForm setCurrentPet={setCurrentPetAtom} setCustomPets={setCustomPetsAtom} onCreateSuccess={onCreateSuccess} />
    </div>
  );
};
