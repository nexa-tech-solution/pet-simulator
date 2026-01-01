import { ActionButtonSection } from '@/features/home/ActionButtonSection';
import { CloudSection } from '@/features/home/CloudSection';
import { HeaderSection } from '@/features/home/HeaderSection';
import PetSection from '@/features/home/PetSection';
import { TrackingInfoSection } from '@/features/home/TrackingInfoSection';

export default async function HomePage() {
  return (
    <div className='flex flex-col min-h-screen w-full overflow-hidden transition-colors duration-1000 bg-linear-to-b from-sky-300 via-blue-100 to-white dark:from-slate-700 dark:via-slate-800 dark:to-slate-900'>
      {/* Day Mode: Moving Clouds */}
      <CloudSection />
      <HeaderSection />
      <PetSection />
      <ActionButtonSection />
      <TrackingInfoSection />
    </div>
  );
}
