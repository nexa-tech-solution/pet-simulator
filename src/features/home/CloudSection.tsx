'use client';
import { isSleeping } from '@/store/pet.store';
import { useAtom } from 'jotai';
import { Cloud, Moon, Star } from 'lucide-react';

const NIGHT_STARS = [
  { top: '8%', left: '18%', delay: '0s', size: 12 },
  { top: '14%', left: '68%', delay: '0.4s', size: 8 },
  { top: '28%', left: '42%', delay: '0.8s', size: 12 },
  { top: '34%', left: '82%', delay: '1.2s', size: 8 },
  { top: '18%', left: '30%', delay: '1.6s', size: 12 },
  { top: '38%', left: '58%', delay: '2s', size: 8 },
];

export const CloudSection = () => {
  const [isSleepingAtom] = useAtom(isSleeping);

  return (
    <div className='absolute inset-0 overflow-x-hidden pointer-events-none'>
      {isSleepingAtom ? (
        <>
          {NIGHT_STARS.map((star, i) => (
            <div
              key={i}
              className='absolute text-yellow-100 animate-[twinkle_3s_ease-in-out_infinite]'
              style={{
                top: star.top,
                left: star.left,
                animationDelay: star.delay,
              }}
            >
              <Star size={star.size} fill='currentColor' />
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
