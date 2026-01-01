import { Cloud } from 'lucide-react';

export const CloudSection = () => {
  return (
    <div className='absolute inset-0 overflow-x-hidden pointer-events-none'>
      <div className='absolute top-10 -left-32 text-white/40 animate-[moveClouds_20s_linear_infinite]' style={{ animationDelay: '0s' }}>
        <Cloud size={64} fill='currentColor' />
      </div>

      <div className='absolute top-32 -left-32 text-white/30 animate-[moveClouds_25s_linear_infinite]' style={{ animationDelay: '-10s' }}>
        <Cloud size={48} fill='currentColor' />
      </div>

      <div className='absolute top-20 -left-32 text-white/20 animate-[moveClouds_30s_linear_infinite]' style={{ animationDelay: '-5s' }}>
        <Cloud size={80} fill='currentColor' />
      </div>
    </div>
  );
};
