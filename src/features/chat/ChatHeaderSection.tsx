'use client';

import { isLightMode } from '@/store/theme.store';
import { useAtom } from 'jotai';

export const ChatHeaderSection = () => {
  const [lightModeAtom] = useAtom(isLightMode);
  return (
    <header className='px-4 py-8 text-center relative'>
      <h1
        className={`text-4xl md:text-5xl font-black transition-colors duration-1000 ${!lightModeAtom ? 'text-indigo-300' : 'text-blue-600'} drop-shadow-sm mb-2 flex items-center justify-center gap-3`}
      >
        {/* <i className='fas fa-paw'></i> PetPal Chat */}
        <span>🐾 PetPal Chat</span>
      </h1>
      <p className={`font-medium transition-colors duration-1000 ${!lightModeAtom ? 'text-indigo-400' : 'text-gray-500'}`}>
        {'Choose a furry friend to talk to!'}
      </p>
    </header>
  );
};
