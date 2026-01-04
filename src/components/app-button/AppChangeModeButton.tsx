'use client';

import { isLightMode } from '@/store/theme.store';
import { useAtom } from 'jotai';
import { Cloud, Moon, Star, Sun } from 'lucide-react';
import { useLayoutEffect } from 'react';

export const AppChangeModeButton = () => {
  const [lightMode, setLightMode] = useAtom(isLightMode);

  const handleToggle = () => {
    const next = !lightMode;
    setLightMode(next);

    // Update <html> class for Tailwind
    // if (next) document.documentElement.classList.remove('dark');
    // else document.documentElement.classList.add('dark');
  };

  // EFFECT
  useLayoutEffect(() => {
    if (lightMode) document.documentElement.classList.remove('dark');
    else document.documentElement.classList.add('dark');
  }, [lightMode]);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      }}
      className={`relative cursor-pointer w-16 h-9 rounded-full p-1 transition-all duration-500 shadow-inner ${lightMode ? 'bg-sky-200' : 'bg-slate-800'}`}
    >
      {/* Background Icons */}
      <div className='absolute inset-0 flex justify-between items-center px-2 opacity-50'>
        <Cloud size={12} className={`text-white transition-opacity duration-300 ${lightMode ? 'opacity-100' : 'opacity-0'}`} />
        <Star
          size={10}
          className={`text-yellow-200 transition-opacity duration-300 ${lightMode ? 'opacity-0' : 'opacity-100'}`}
          fill='currentColor'
        />
      </div>

      {/* Moving Knob */}
      <div
        className={`relative w-7 h-7 rounded-full shadow-md transition-all duration-500 cubic-bezier(0.4, 0.0, 0.2, 1) flex items-center justify-center z-10 ${lightMode ? 'translate-x-0 bg-white text-orange-400' : 'translate-x-7 bg-slate-700 text-yellow-300'}`}
      >
        {lightMode ? <Sun size={14} fill='currentColor' /> : <Moon size={14} fill='currentColor' />}
      </div>
    </button>
  );
};
