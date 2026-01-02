'use client';

import { currentPet, feedbacks, isSleeping } from '@/store/pet.store';
import { PETS } from '@/utils/constants/pet.constant';
import { PetType } from '@/utils/types/pet.type';
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
  const [feedbackAtom, setFeedbackAtom] = useAtom(feedbacks);

  const selectedPet = useMemo(() => PETS.get(currentPetAtom), [currentPetAtom]);
  const selectedImage = useMemo<PetType | null>(
    () => (isSleepingAtom ? (selectedPet?.sleep ?? null) : (selectedPet ?? null)),
    [isSleepingAtom, selectedPet],
  );

  // METHOD
  const removeFeedback = (id: number) => {
    setFeedbackAtom((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Stack flex={1} align='center' justify='center' className='relative'>
      {selectedImage?.imageType === 'rive' ? (
        <Rive
          key={currentPetAtom}
          src={selectedImage?.imageUrl}
          stateMachines={selectedImage?.stateMachines}
          className='w-[60vw] h-[50vh] md:w-[60vw] md:h-[60vh] lg:w-[70vw] lg:h-[70vh]'
        />
      ) : selectedImage?.imageType === 'lottie' ? (
        <Lottie animationData={selectedImage?.imageUrl} loop={true} className='w-[60vw] h-[50vh] md:w-[60vw] md:h-[60vh] lg:w-[70vw] lg:h-[70vh]' />
      ) : selectedImage?.imageType === 'image' ? (
        <Image
          src={selectedImage?.imageUrl}
          alt={selectedImage?.name}
          className='w-[60vw] h-[50vh] md:w-[60vw] md:h-[60vh] lg:w-[70vw] lg:h-[70vh] object-contain'
        />
      ) : null}

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
