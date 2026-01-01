import { AppProgressBar } from '@/components/app-progress-bar/AppProgressBar';
import { Stack } from '@mantine/core';
import { Heart, Utensils, Zap } from 'lucide-react';

export const TrackingInfoSection = () => {
  return (
    <Stack className='px-4 pb-4'>
      {/* max width clamp */}
      <div className='w-full max-w-360 mx-auto'>
        <div className='bg-white/30 dark:bg-slate-900/40 backdrop-blur-xl p-5 rounded-3xl shadow-lg border border-white/40 dark:border-white/10 animate-[fadeIn_0.5s]'>
          <div className='flex flex-col md:flex-row gap-4'>
            <AppProgressBar value={80} max={100} color='text-orange-500' icon={Utensils} label='Hunger' />
            <AppProgressBar value={50} max={100} color='text-pink-500' icon={Heart} label='Happiness' />
            <AppProgressBar value={10} max={100} color='text-yellow-500' icon={Zap} label='Energy' />
          </div>
        </div>
      </div>
    </Stack>
  );
};
