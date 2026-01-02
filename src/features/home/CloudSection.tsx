'use client';
import { isSleeping } from '@/store/pet.store';
import { useAtom } from 'jotai';
import { Cloud, Moon, Star } from 'lucide-react';

export const CloudSection = () => {
  const [isSleepingAtom] = useAtom(isSleeping);

  return (
    <div className='absolute inset-0 overflow-x-hidden pointer-events-none'>
      {isSleepingAtom ? (
        <>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='absolute text-yellow-100 animate-[twinkle_3s_ease-in-out_infinite]'
              style={{
                // eslint-disable-next-line react-hooks/purity
                top: `${Math.random() * 40}%`,
                // eslint-disable-next-line react-hooks/purity
                left: `${Math.random() * 80 + 10}%`,
                // eslint-disable-next-line react-hooks/purity
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              <Star size={Math.random() > 0.5 ? 12 : 8} fill='currentColor' />
            </div>
          ))}
        </>
      ) : (
        <>
          <div className='absolute top-10 -left-32 text-white/40 animate-[moveClouds_20s_linear_infinite]' style={{ animationDelay: '0s' }}>
            <Cloud size={64} fill='currentColor' />
          </div>
          <div className='absolute top-32 -left-32 text-white/30 animate-[moveClouds_25s_linear_infinite]' style={{ animationDelay: '-10s' }}>
            <Cloud size={48} fill='currentColor' />
          </div>
          <div className='absolute top-20 -left-32 text-white/20 animate-[moveClouds_30s_linear_infinite]' style={{ animationDelay: '-5s' }}>
            <Cloud size={80} fill='currentColor' />
          </div>
        </>
      )}

      <div
        className='absolute inset-0 opacity-[0.03] dark:opacity-[0.05]'
        style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      ></div>

      <div
        className={`absolute top-20 right-10 transition-all duration-1000 transform ${isSleepingAtom ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}
      >
        <Moon className='text-yellow-100 opacity-20' size={120} />
      </div>
    </div>
  );
};
