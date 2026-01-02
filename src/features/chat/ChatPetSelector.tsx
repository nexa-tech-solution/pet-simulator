'use client';

import { isLightMode } from '@/store/theme.store';
import { useAtom } from 'jotai';

export const ChatPetSelector = () => {
  const [lightModeAtom] = useAtom(isLightMode);
  return (
    <section className={`mb-6 transition-all duration-1000 ${lightModeAtom ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}></section>
  );
};
