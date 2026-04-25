'use client';

import { isValidPetImageUrl } from '@/utils/helpers/pet.helper';
import { PetType } from '@/utils/types/pet.type';
import Rive from '@rive-app/react-canvas';
import Lottie from 'lottie-react';
import Image from 'next/image';

type PetPreviewImageProps = {
  selectedPet: PetType;
  displayName: string;
  isBuiltInPet: boolean;
  draftImageUrl: string;
};

export const PetPreviewImage = ({ selectedPet, displayName, isBuiltInPet, draftImageUrl }: PetPreviewImageProps) => {
  const previewImage = selectedPet.wakeup;

  if (!isBuiltInPet && draftImageUrl && isValidPetImageUrl(draftImageUrl)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={draftImageUrl} alt={displayName} className='w-full h-full object-cover' />
    );
  }

  if (isBuiltInPet && previewImage?.imageType === 'rive') {
    return <Rive src={previewImage.imageUrl} stateMachines={previewImage.stateMachines} className='w-full h-full pointer-events-none' />;
  }

  if (isBuiltInPet && previewImage?.imageType === 'lottie') {
    return <Lottie animationData={previewImage.imageUrl} loop className='w-full h-full p-1' />;
  }

  if (isBuiltInPet && previewImage?.imageType === 'image') {
    return <Image src={previewImage.imageUrl} alt={displayName} className='w-full h-full object-contain p-1' />;
  }

  return <span className='text-2xl font-black text-slate-300 dark:text-slate-500'>{displayName.slice(0, 1).toUpperCase()}</span>;
};
