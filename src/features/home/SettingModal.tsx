'use client';

import { AppChangeModeButton } from '@/components/app-button/AppChangeModeButton';
import { isLightMode } from '@/store/theme.store';
import { useAtom } from 'jotai';
import { Bell, Cat, Moon, Music, Settings, Sun, X } from 'lucide-react';
import { useState } from 'react';

export const SettingModal = () => {
  const isSleeping = false;

  // STATE
  const [isOpen, setIsOpen] = useState(false);
  const [lightMode, setLightMode] = useAtom(isLightMode);

  return (
    <>
      <button
        className='cursor-pointer bg-slate-900/5 dark:bg-white/10 backdrop-blur-md p-1.5 rounded-full flex items-center gap-2 border border-white/20'
        onClick={() => setIsOpen(true)}
      >
        <Settings size={20} className={isSleeping ? 'text-white' : 'text-slate-600 dark:text-white'} />
      </button>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-end md:justify-end bg-slate-900/20 backdrop-blur-sm'>
          <div className='bg-white dark:bg-slate-800 w-full md:w-[50%] h-[60%] md:h-full rounded-t-2xl md:rounded-t-none md:rounded-l-2xl p-6 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)] md:animate-[slideInRight_0.4s_cubic-bezier(0.16,1,0.3,1)] shadow-2xl flex flex-col'>
            <div className='flex justify-between items-center mb-8 px-2'>
              <div>
                <h2 className='text-2xl font-black text-slate-800 dark:text-white'>Settings</h2>
                <p className='text-slate-500 text-md'>Customize your experience</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className='p-2 cursor-pointer bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 hover:bg-slate-200'
              >
                <X size={24} />
              </button>
            </div>

            <div className='space-y-4'>
              {/* Pet Selection */}
              <div className='bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 p-4'>
                <h3 className='font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2'>
                  <Cat size={18} className='text-indigo-500' /> Choose Companion
                </h3>
                <div className='grid grid-cols-4 gap-2'>
                  {['cat', 'dog', 'fish', 'bird'].map((type) => (
                    <button
                      key={type}
                      onClick={(e) => {}}
                      className={`
                              flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all
                              ${
                                false
                                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300'
                                  : 'border-transparent bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400'
                              }
                            `}
                    >
                      {type === 'cat' && <Cat size={24} />}

                      <span className='text-[10px] font-bold uppercase mt-1'>{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <div className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors'>
                <div className='flex items-center gap-3'>
                  <div
                    className={`
                          p-3 rounded-xl transition-colors duration-300
                          ${!lightMode ? 'bg-indigo-900 text-indigo-300' : 'bg-orange-100 text-orange-500'}
                        `}
                  >
                    {!lightMode ? <Moon size={24} /> : <Sun size={24} />}
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-bold text-slate-800 dark:text-white'>Theme</span>
                    <span className='text-xs text-slate-400 font-medium'>{!lightMode ? 'Night Mode' : 'Day Mode'}</span>
                  </div>
                </div>

                <AppChangeModeButton />
              </div>

              {/* Placeholder for Audio */}
              <div className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 opacity-70'>
                <div className='flex items-center gap-3'>
                  <div className='p-3 bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300 rounded-xl'>
                    <Music size={24} />
                  </div>
                  <span className='font-bold text-slate-800 dark:text-white'>Sound Effects</span>
                </div>
                <div className='text-xs font-bold text-slate-400 uppercase'>Coming Soon</div>
              </div>

              {/* Placeholder for Notifications */}
              <div className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 opacity-70'>
                <div className='flex items-center gap-3'>
                  <div className='p-3 bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300 rounded-xl'>
                    <Bell size={24} />
                  </div>
                  <span className='font-bold text-slate-800 dark:text-white'>Notifications</span>
                </div>
                <div className='text-xs font-bold text-slate-400 uppercase'>Coming Soon</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
