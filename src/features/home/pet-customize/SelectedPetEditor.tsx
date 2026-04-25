'use client';

import { currentPet, customPets, petProfiles } from '@/store/pet.store';
import { PET_ENUM } from '@/utils/enums/pet.enum';
import { readImageFile } from '@/utils/helpers/file.helper';
import {
  MAX_PET_NAME_LENGTH,
  getPetDisplayName,
  getPetProfile,
  isBuiltInPetId,
  isValidPetImageUrl,
  normalizePetImageUrl,
  normalizePetName,
} from '@/utils/helpers/pet.helper';
import { PetIdType, PetType } from '@/utils/types/pet.type';
import { useAtom } from 'jotai';
import { RotateCcw, Save, UserRound } from 'lucide-react';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { DeletePetButton } from './DeletePetButton';
import { ImageControls } from './ImageControls';
import { PetPreviewImage } from './PetPreviewImage';

type SelectedPetEditorProps = {
  petId: PetIdType;
  selectedPet: PetType;
};

export const SelectedPetEditor = ({ petId, selectedPet }: SelectedPetEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setCurrentPetAtom] = useAtom(currentPet);
  const [petProfilesAtom, setPetProfilesAtom] = useAtom(petProfiles);
  const [customPetsAtom, setCustomPetsAtom] = useAtom(customPets);
  const isBuiltInPet = isBuiltInPetId(petId);
  const customPet = !isBuiltInPet && typeof petId === 'string' ? customPetsAtom[petId] : null;
  const profile = useMemo(() => getPetProfile(petProfilesAtom, petId), [petId, petProfilesAtom]);
  const [draftName, setDraftName] = useState(isBuiltInPet ? (profile.name ?? '') : (customPet?.name ?? ''));
  const [draftImageUrl, setDraftImageUrl] = useState(customPet?.imageUrl ?? '');
  const [errorText, setErrorText] = useState('');
  const [savedText, setSavedText] = useState('');
  const displayName = getPetDisplayName(selectedPet, { name: normalizePetName(draftName) || profile.name });

  const saveBuiltInPet = (normalizedName: string) => {
    setPetProfilesAtom((prev) => {
      const nextProfiles = { ...prev };

      if (!normalizedName) {
        delete nextProfiles[petId];
        return nextProfiles;
      }

      nextProfiles[petId] = { name: normalizedName };
      return nextProfiles;
    });
  };

  const saveCustomPet = (normalizedName: string, normalizedImageUrl: string) => {
    if (!customPet) return;

    setCustomPetsAtom((prev) => ({
      ...prev,
      [customPet.id]: {
        ...customPet,
        name: normalizedName || customPet.name,
        imageUrl: normalizedImageUrl,
      },
    }));
  };

  const handleSave = () => {
    const normalizedName = normalizePetName(draftName);
    const normalizedImageUrl = normalizePetImageUrl(draftImageUrl);

    if (!isBuiltInPet && !normalizedImageUrl) {
      setErrorText('Custom pets need an image.');
      setSavedText('');
      return;
    }

    if (!isBuiltInPet && !isValidPetImageUrl(normalizedImageUrl)) {
      setErrorText('Use an http, https, local, PNG, JPG, WEBP, or GIF image.');
      setSavedText('');
      return;
    }

    if (isBuiltInPet) saveBuiltInPet(normalizedName);
    else saveCustomPet(normalizedName, normalizedImageUrl);

    setErrorText('');
    setSavedText('Saved');
  };

  const handleReset = () => {
    if (isBuiltInPet) {
      saveBuiltInPet('');
      setDraftName('');
    } else if (customPet) {
      setDraftName(customPet.name);
      setDraftImageUrl(customPet.imageUrl);
    }

    setErrorText('');
    setSavedText('Reset');
  };

  const handleDelete = () => {
    if (!customPet) return;

    setCustomPetsAtom((prev) => {
      const nextPets = { ...prev };
      delete nextPets[customPet.id];
      return nextPets;
    });
    setPetProfilesAtom((prev) => {
      const nextProfiles = { ...prev };
      delete nextProfiles[customPet.id];
      return nextProfiles;
    });
    setCurrentPetAtom(PET_ENUM.BLACK_CAT);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    readImageFile(
      file,
      (imageUrl) => {
        setDraftImageUrl(imageUrl);
        setErrorText('');
        setSavedText('Image ready');
      },
      (message) => {
        setErrorText(message);
        setSavedText('');
      },
    );
  };

  return (
    <div className='flex flex-col gap-4 border-b border-slate-200 dark:border-slate-600 pb-4'>
      <div className='flex items-center gap-3'>
        <div className='w-[72px] h-[72px] rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0'>
          <PetPreviewImage selectedPet={selectedPet} displayName={displayName} isBuiltInPet={isBuiltInPet} draftImageUrl={draftImageUrl} />
        </div>

        <div className='min-w-0'>
          <p className='text-sm font-bold text-slate-800 dark:text-white truncate'>{displayName}</p>
          <p className='text-xs text-slate-500 dark:text-slate-300'>{isBuiltInPet ? 'Built-in pet: name only' : 'Custom pet: name and image'}</p>
        </div>
      </div>

      <label className='flex flex-col gap-2'>
        <span className='text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5'>
          <UserRound size={14} /> Name
        </span>
        <input
          value={draftName}
          maxLength={MAX_PET_NAME_LENGTH}
          onChange={(event) => {
            setDraftName(event.target.value);
            setSavedText('');
          }}
          placeholder={selectedPet.name}
          className='w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-400'
        />
      </label>

      {!isBuiltInPet && (
        <ImageControls
          imageUrl={draftImageUrl}
          setImageUrl={setDraftImageUrl}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          setSavedText={setSavedText}
        />
      )}

      <div className='flex flex-wrap items-center gap-2'>
        <button
          type='button'
          onClick={handleSave}
          className='h-10 px-3 rounded-xl bg-indigo-500 text-white text-sm font-bold flex items-center gap-2 hover:bg-indigo-600 transition'
        >
          <Save size={16} /> Save
        </button>
        <button
          type='button'
          onClick={handleReset}
          className='h-10 px-3 rounded-xl bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-white text-sm font-bold flex items-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-500 transition'
        >
          <RotateCcw size={16} /> Reset
        </button>
        {!isBuiltInPet && customPet && <DeletePetButton onDelete={handleDelete} />}
      </div>

      {(errorText || savedText) && (
        <p className={`text-xs font-semibold ${errorText ? 'text-red-500' : 'text-emerald-500'}`}>{errorText || savedText}</p>
      )}
    </div>
  );
};
