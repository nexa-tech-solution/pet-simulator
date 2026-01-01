'use client';

import { AppActionButton } from '@/components/app-action-button/AppActionButton';
import { Gamepad2, MessageCircle, Moon, Utensils } from 'lucide-react';

export const ActionButtonSection = () => {
  return (
    <div className='absolute right-4 top-[40%] md:top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-4 items-end animate-[fadeIn_0.5s]'>
      <AppActionButton isFab={true} onClick={() => {}} icon={Utensils} label='Eat' color='text-orange-500 bg-orange-500' />
      <AppActionButton isFab={true} onClick={() => {}} icon={Gamepad2} label='Play' color='text-pink-500 bg-pink-500' />
      <AppActionButton isFab={true} onClick={() => {}} icon={Moon} label={'Sleep'} color='text-indigo-500 bg-indigo-500' />
      <AppActionButton isFab={true} onClick={() => {}} icon={MessageCircle} label='Talk' color='text-blue-500 bg-blue-500' />
    </div>
  );
};
