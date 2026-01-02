'use client';

type AppActionButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon: React.ElementType;
  label: string;
  color: string;
  disabled?: boolean;
  isSecondary?: boolean;
  isFab?: boolean;
};

export const AppActionButton = ({ onClick, icon: Icon, label, color, disabled, isSecondary, isFab }: AppActionButtonProps) => (
  <button
    onClick={(e) => onClick(e)}
    disabled={disabled}
    className={`
      relative group overflow-hidden
      flex flex-col items-center justify-center 
      transition-all duration-200 active:scale-95 active:shadow-inner
      ${
        isFab
          ? 'rounded-full w-16 h-16 shadow-xl hover:scale-105 z-40' // Circular FAB styles
          : 'gap-2 p-3 rounded-2xl w-full border-b-4' // Original Rectangular styles
      }
      ${
        disabled
          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-600'
          : isSecondary
            ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 cursor-pointer'
            : isFab
              ? 'bg-white/90 backdrop-blur-md border-2 border-white dark:bg-slate-700/90 dark:border-slate-600 dark:text-white shadow-2xl cursor-pointer' // Improved FAB contrast
              : 'bg-white border-gray-100 hover:shadow-lg text-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-900 shadow-md'
      }
      ${!isFab && !disabled && !isSecondary ? 'hover:-translate-y-1 hover:border-b-8' : ''} 
    `}
  >
    <div
      className={`
      relative z-10 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center
      ${isFab ? 'w-full h-full' : 'p-2 rounded-xl'}
      ${!isFab && (disabled ? 'bg-gray-200 dark:bg-gray-700' : `${color} bg-opacity-10 dark:bg-opacity-20`)}
    `}
    >
      <Icon size={isFab ? 28 : 24} className={disabled ? 'text-gray-400' : color.replace('bg-', 'text-')} />
    </div>

    {!isFab && <span className='font-bold text-[10px] uppercase tracking-wide z-10 text-center leading-tight'>{label}</span>}
  </button>
);
