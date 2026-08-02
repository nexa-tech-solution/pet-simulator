'use client';

import { usePetSound } from '@/hooks/usePetSound';
import { isSoundEnabled, soundVolume } from '@/store/settings.store';
import { useAtom } from 'jotai';
import { Volume2, VolumeX } from 'lucide-react';
import { useTranslations } from 'next-intl';

/** Sound on/off plus volume. Both persist to localStorage via `settings.store`. */
export const SoundSettings = () => {
  const t = useTranslations('settings');
  const [soundEnabled, setSoundEnabled] = useAtom(isSoundEnabled);
  const [volume, setVolume] = useAtom(soundVolume);
  const { preview } = usePetSound();
  const volumePercent = Math.round(volume * 100);

  const handleToggle = () => {
    const next = !soundEnabled;

    setSoundEnabled(next);
    // Preview on enable — `preview` bypasses the setting, which has not reached this render yet.
    if (next) preview();
  };

  return (
    <div className='p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div
            className={`p-3 rounded-xl transition-colors duration-300 ${
              soundEnabled
                ? 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300'
                : 'bg-slate-200 text-slate-500 dark:bg-slate-600 dark:text-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </div>
          <div className='flex flex-col'>
            <span className='font-bold text-slate-800 dark:text-white'>{t('sound')}</span>
            <span className='text-xs text-slate-400 font-medium'>{soundEnabled ? t('soundHint') : t('off')}</span>
          </div>
        </div>

        <button
          type='button'
          role='switch'
          aria-checked={soundEnabled}
          aria-label={t('sound')}
          onClick={handleToggle}
          className={`relative w-16 h-9 shrink-0 cursor-pointer rounded-full p-1 shadow-inner transition-all duration-300 ${
            soundEnabled ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full bg-white shadow-md transition-transform duration-300 ${soundEnabled ? 'translate-x-7' : 'translate-x-0'}`}
          />
        </button>
      </div>

      {soundEnabled && (
        <div className='mt-4 flex items-center gap-3'>
          <VolumeX size={16} className='shrink-0 text-slate-400' />
          <input
            type='range'
            min={0}
            max={100}
            step={5}
            value={volumePercent}
            aria-label={t('volume')}
            onChange={(event) => setVolume(Number(event.target.value) / 100)}
            // Preview on release rather than on every step, so dragging isn't a machine-gun.
            onPointerUp={(event) => preview(Number(event.currentTarget.value) / 100)}
            onKeyUp={(event) => preview(Number(event.currentTarget.value) / 100)}
            // A range input's filled portion can't be styled in WebKit, so paint it with a
            // hard-stop gradient. Past the thumb it falls through to the track background.
            style={{ backgroundImage: `linear-gradient(to right, var(--color-pink-500) ${volumePercent}%, transparent ${volumePercent}%)` }}
            className='h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-pink-500 dark:bg-slate-600'
          />
          <Volume2 size={16} className='shrink-0 text-slate-400' />
          <span className='w-10 shrink-0 text-right text-xs font-bold text-slate-500 dark:text-slate-300'>{volumePercent}%</span>
        </div>
      )}
    </div>
  );
};
