'use client';

import { AppChangeModeButton } from '@/components/app-button/AppChangeModeButton';
import { currentPet, isSleeping, stats } from '@/store/pet.store';
import { PETS } from '@/utils/constants/pet.constant';
import { Group, Stack } from '@mantine/core';
import { useAtom } from 'jotai';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SettingModal } from './SettingModal';

type HeaderSectionProps = {
  withBack?: boolean;
};

export const HeaderSection = ({ withBack }: HeaderSectionProps) => {
  const [currentPetAtom] = useAtom(currentPet);
  const [isSleepingAtom] = useAtom(isSleeping);
  const [statsAtom] = useAtom(stats);

  const router = useRouter();

  const handleBack = () => {
    router.back(); // fallback mặc định
  };

  return (
    <Stack className='px-4 py-4'>
      <Group align='center' justify='space-between'>
        <Group gap={10} align='center'>
          {withBack && (
            <button
              onClick={handleBack}
              className='w-10 h-10 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/30 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition'
            >
              <ChevronLeft className='w-5 h-5 text-slate-700 dark:text-white' />
            </button>
          )}
          <Stack gap={2}>
            <h1
              className={`text-3xl font-black tracking-tighter transition-all duration-500 ${isSleepingAtom ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm'}`}
            >
              {PETS.get(currentPetAtom)?.name || ''}
            </h1>
            {/* <span className='bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-lg shadow-sm border border-yellow-300 flex items-center gap-1'>
            <Star size={10} fill='currentColor' /> LV 5
          </span> */}
            <div className='bg-slate-900/5 dark:bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20 w-fit'>
              <div className='w-4 h-4 rounded-full bg-yellow-400 border-2 border-yellow-500 flex items-center justify-center'>
                <span className='text-[10px] font-bold text-yellow-800'>$</span>
              </div>
              <span className={`font-mono font-bold text-sm ${isSleepingAtom ? 'text-white' : 'text-slate-700 dark:text-white'}`}>
                {statsAtom?.coins || 0}
              </span>
            </div>
          </Stack>
        </Group>

        <Stack gap={4} align='flex-end'>
          <Group gap={2}>
            <SettingModal />
            <AppChangeModeButton />
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};
