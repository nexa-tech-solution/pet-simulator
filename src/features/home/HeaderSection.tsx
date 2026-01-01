import { Group, Stack } from '@mantine/core';
import { Settings, Star } from 'lucide-react';

export const HeaderSection = () => {
  const isSleeping = false;
  return (
    <Stack className='px-4 py-4'>
      <Group align='center' justify='space-between'>
        <Stack gap={2}>
          <h1 className='text-3xl font-black tracking-tighter transition-all duration-500 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm'>
            Milu
          </h1>
          <span className='bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-lg shadow-sm border border-yellow-300 flex items-center gap-1'>
            <Star size={10} fill='currentColor' /> LV 5
          </span>
        </Stack>
        <Stack gap={4} align='flex-end'>
          <div className='bg-slate-900/5 dark:bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20'>
            <div className='w-4 h-4 rounded-full bg-yellow-400 border-2 border-yellow-500 flex items-center justify-center'>
              <span className='text-[10px] font-bold text-yellow-800'>$</span>
            </div>
            <span className={`font-mono font-bold text-sm ${isSleeping ? 'text-white' : 'text-slate-700 dark:text-white'}`}>10</span>
          </div>

          <Group gap={2}>
            <button className='bg-slate-900/5 dark:bg-white/10 backdrop-blur-md p-1.5 rounded-full flex items-center gap-2 border border-white/20'>
              <Settings size={20} className={isSleeping ? 'text-white' : 'text-slate-600 dark:text-white'} />
            </button>
            <button className='bg-slate-900/5 dark:bg-white/10 backdrop-blur-md p-1.5 rounded-full flex items-center gap-2 border border-white/20'>
              <Settings size={20} className={isSleeping ? 'text-white' : 'text-slate-600 dark:text-white'} />
            </button>
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};
