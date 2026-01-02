'use client';

import { useEffect } from 'react';

type FloatingTextProps = {
  x: string;
  y: string;
  text: string;
  color: string;
  onComplete: () => void;
};

export const FloatingText = ({ x, y, text, color, onComplete }: FloatingTextProps) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className='absolute pointer-events-none animate-[floatUp_1s_ease-out] font-black text-xl z-50 shadow-sm'
      style={{ left: x, top: y, color: color, textShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}
    >
      {text}
    </div>
  );
};
