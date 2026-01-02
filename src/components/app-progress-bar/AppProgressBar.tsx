type AppProgressBarProps = {
  value: number;
  max: number;
  color: string;
  icon: React.ElementType;
  label: string;
};

export const AppProgressBar = ({ value, max, color, icon: Icon, label }: AppProgressBarProps) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  // Dynamic color based on percentage
  let barColor = 'bg-green-500';
  if (percentage < 30) barColor = 'bg-red-500';
  else if (percentage < 60) barColor = 'bg-yellow-400';

  return (
    <div className='flex flex-col gap-1 w-full group'>
      <div className='flex justify-between text-xs font-bold text-gray-600 dark:text-gray-300 group-data-[sleep=true]:text-gray-300 px-1 uppercase tracking-wider drop-shadow-sm'>
        <span className='flex items-center gap-1.5'>
          <Icon size={12} className={color} /> {label}
        </span>
        <span className='font-mono'>{Math.round(percentage)}%</span>
      </div>
      <div className='h-5 w-full bg-black/5 dark:bg-white/10 rounded-full p-1 backdrop-blur-sm border border-white/20 dark:border-white/5 shadow-inner'>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm relative overflow-hidden ${barColor}`}
          style={{ width: `${percentage}%` }}
        >
          <div className='absolute top-0 left-0 right-0 h-[40%] bg-white opacity-30 rounded-t-full'></div>
        </div>
      </div>
    </div>
  );
};
