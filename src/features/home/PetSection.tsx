'use client';

import { usePetSound } from '@/hooks/usePetSound';
import { currentPet, customPets, feedbacks, isSleeping, petProfiles } from '@/store/pet.store';
import { PETS } from '@/utils/constants/pet.constant';
import { getCustomPetAsPet, getPetDisplayName, getPetProfile, isBuiltInPetId } from '@/utils/helpers/pet.helper';
import { PetImageType } from '@/utils/types/pet.type';
import { Stack } from '@mantine/core';
import Rive from '@rive-app/react-canvas';
import { useAtom } from 'jotai';
import Lottie from 'lottie-react';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';
import { FloatingText } from './FloatingText';

export default function PetSection() {
  const [currentPetAtom] = useAtom(currentPet);
  const [isSleepingAtom] = useAtom(isSleeping);
  const [customPetsAtom] = useAtom(customPets);
  const [petProfilesAtom] = useAtom(petProfiles);
  const [feedbackAtom, setFeedbackAtom] = useAtom(feedbacks);
  const { play } = usePetSound();

  const isBuiltInPet = useMemo(() => isBuiltInPetId(currentPetAtom), [currentPetAtom]);
  const selectedPet = useMemo(
    () => (isBuiltInPetId(currentPetAtom) ? PETS.get(currentPetAtom) : getCustomPetAsPet(customPetsAtom, currentPetAtom)),
    [currentPetAtom, customPetsAtom],
  );
  const selectedProfile = useMemo(() => getPetProfile(petProfilesAtom, currentPetAtom), [currentPetAtom, petProfilesAtom]);
  const displayName = useMemo(() => (selectedPet ? getPetDisplayName(selectedPet, selectedProfile) : ''), [selectedPet, selectedProfile]);
  const customImageUrl = useMemo(
    () => (!isBuiltInPet && selectedPet?.wakeup?.imageUrl ? selectedPet.wakeup.imageUrl : ''),
    [isBuiltInPet, selectedPet],
  );
  const selectedImage = useMemo<PetImageType | null>(
    () => (isSleepingAtom ? (selectedPet?.sleep ?? null) : (selectedPet?.wakeup ?? null)),
    [isSleepingAtom, selectedPet],
  );
  const petDisplayClass = useMemo(
    () =>
      isSleepingAtom
        ? 'w-[60vw] h-[50vh] md:w-[56vw] md:h-[52vh] lg:w-[42vw] lg:h-[40vh] xl:w-[38vw] xl:h-[36vh]'
        : 'w-[60vw] h-[50vh] md:w-[60vw] md:h-[60vh] lg:w-[70vw] lg:h-[70vh]',
    [isSleepingAtom],
  );

  // METHOD
  const removeFeedback = (id: number) => {
    setFeedbackAtom((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Stack flex={1} align='center' justify='center' className='relative'>
      {/* Tap the pet to hear it. onClick covers both pointer and keyboard activation. */}
      <button
        type='button'
        aria-label={displayName}
        onClick={() => play()}
        className='cursor-pointer select-none border-0 bg-transparent p-0 transition-transform duration-200 active:scale-95'
      >
        {customImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={customImageUrl} alt={displayName} className={`${petDisplayClass} object-contain`} draggable={false} />
        ) : selectedImage?.imageType === 'rive' ? (
          <Rive key={currentPetAtom} src={selectedImage?.imageUrl} stateMachines={selectedImage?.stateMachines} className={petDisplayClass} />
        ) : selectedImage?.imageType === 'lottie' ? (
          <Lottie animationData={selectedImage?.imageUrl} loop={true} className={petDisplayClass} />
        ) : selectedImage?.imageType === 'image' ? (
          <Image src={selectedImage?.imageUrl} alt={displayName} unoptimized className={`${petDisplayClass} object-contain`} draggable={false} />
        ) : null}
      </button>

      <div className='absolute top-1/4 right-1/4 z-20'>
        {!isSleepingAtom && <Heart className='text-pink-500 fill-pink-500 animate-bounce drop-shadow-lg' size={40} />}
        {/* {!isSleeping && mood === 'sad' && (
          <div className='bg-blue-500 text-white font-bold text-xl px-3 py-1 rounded-full animate-pulse shadow-lg'>?</div>
        )} */}
        {isSleepingAtom && (
          <div className='flex flex-col -space-y-4 ml-8 -mt-4'>
            <span className='text-indigo-400 font-bold text-2xl animate-[floatUp_2s_infinite] opacity-0' style={{ animationDelay: '0s' }}>
              Z
            </span>
            <span className='text-indigo-400 font-bold text-3xl animate-[floatUp_2s_infinite] opacity-0' style={{ animationDelay: '0.5s' }}>
              Z
            </span>
            <span className='text-indigo-400 font-bold text-4xl animate-[floatUp_2s_infinite] opacity-0' style={{ animationDelay: '1s' }}>
              Z
            </span>
          </div>
        )}
      </div>

      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        {feedbackAtom?.map((f) => (
          <FloatingText key={f.id} {...f} onComplete={() => removeFeedback(f.id)} />
        ))}
      </div>
    </Stack>
  );
}
