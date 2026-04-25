'use client';

import { readImageFile } from '@/utils/helpers/file.helper';
import {
  MAX_PET_NAME_LENGTH,
  MAX_PET_PERSONALITY_LENGTH,
  createCustomPetId,
  isValidPetImageUrl,
  normalizePetImageUrl,
  normalizePetName,
  normalizePetPersonality,
} from '@/utils/helpers/pet.helper';
import { CustomPetType, PetIdType } from '@/utils/types/pet.type';
import { Plus } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';
import { ImageControls } from './ImageControls';

type CreatePetFormProps = {
  setCurrentPet: (petId: PetIdType) => void;
  setCustomPets: (update: (prev: Record<string, CustomPetType>) => Record<string, CustomPetType>) => void;
};

export const CreatePetForm = ({ setCurrentPet, setCustomPets }: CreatePetFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleCreate = () => {
    const normalizedName = normalizePetName(name);
    const normalizedPersonality = normalizePetPersonality(personality);
    const normalizedImageUrl = normalizePetImageUrl(imageUrl);

    if (!normalizedName) {
      setErrorText('Name your new pet first.');
      return;
    }

    if (!normalizedImageUrl || !isValidPetImageUrl(normalizedImageUrl)) {
      setErrorText('Add a valid image for the new pet.');
      return;
    }

    if (!normalizedPersonality) {
      setErrorText('Describe your new pet personality.');
      return;
    }

    const id = createCustomPetId();
    setCustomPets((prev) => ({
      ...prev,
      [id]: {
        id,
        name: normalizedName,
        imageUrl: normalizedImageUrl,
        personality: `You are ${normalizedName}, a user-created virtual pet. Personality: ${normalizedPersonality}. Stay fully in this personality while chatting.`,
        createdAt: Date.now(),
      },
    }));
    setCurrentPet(id);
    setName('');
    setPersonality('');
    setImageUrl('');
    setErrorText('');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    readImageFile(file, setImageUrl, setErrorText);
  };

  return (
    <div className='flex flex-col gap-3 pt-4'>
      <p className='text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5'>
        <Plus size={14} /> Create New Pet
      </p>
      <input
        value={name}
        maxLength={MAX_PET_NAME_LENGTH}
        onChange={(event) => setName(event.target.value)}
        placeholder='New pet name'
        className='w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400'
      />
      <textarea
        value={personality}
        maxLength={MAX_PET_PERSONALITY_LENGTH}
        onChange={(event) => setPersonality(event.target.value)}
        placeholder='Personality, e.g. brave, dramatic, loves snacks, talks like a tiny boss'
        rows={3}
        className='w-full resize-none rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400'
      />
      <ImageControls
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        setSavedText={() => setErrorText('')}
      />
      <button
        type='button'
        onClick={handleCreate}
        className='h-10 w-fit px-3 rounded-xl bg-pink-500 text-white text-sm font-bold flex items-center gap-2 hover:bg-pink-600 transition'
      >
        <Plus size={16} /> Create Pet
      </button>
      {errorText && <p className='text-xs font-semibold text-red-500'>{errorText}</p>}
    </div>
  );
};
