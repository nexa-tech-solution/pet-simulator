import { ActionButtonSection } from '@/features/home/ActionButtonSection';
import { CloudSection } from '@/features/home/CloudSection';
import { HeaderSection } from '@/features/home/HeaderSection';
import PetSection from '@/features/home/PetSection';
import { TrackingInfoSection } from '@/features/home/TrackingInfoSection';
import { SITE_URL } from '@/utils/constants/meta.constant';
import { Metadata } from 'next';

export async function generateMetadata(props: Omit<LayoutProps<'/[locale]'>, 'children'>): Promise<Metadata> {
  // const { locale } = await props.params;

  // const tCommon = await getTranslations({
  //   locale: locale as Locale,
  //   namespace: 'common',
  // });

  const canonicalUrl = SITE_URL;

  return {
    title: `PetPal | Pet Simulator`,
    description: `PetPal | A virtual pet simulation experience`,
    keywords: ['PetPal', 'virtual pet', 'simulation'],
    icons: {
      icon: [
        // { url: '/favicon.ico', sizes: '16x16', type: 'image/png' },
        // { url: '/favicon.ico', sizes: '32x32', type: 'image/png' },
        // { url: '/favicon.ico', sizes: '48x48', type: 'image/png' },
        { url: '/favicon.ico', sizes: 'any' },
      ],
      // apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    openGraph: {
      title: `PetPal | Pet Simulator`,
      description: `PetPal | A virtual pet simulation experience`,
      url: canonicalUrl,
      siteName: 'PetPal',
      images: [
        {
          url: `${SITE_URL}/images/logo.png`,
          width: 1200,
          height: 630,
          alt: 'PetPal',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}`,
      },
    },
  };
}

export default async function HomePage() {
  return (
    <div
      className='flex flex-col min-h-screen w-full overflow-hidden transition-colors duration-1000 bg-linear-to-b from-sky-300 via-blue-100 to-white dark:from-slate-700 dark:via-slate-800 dark:to-slate-900     group-data-[sleep=true]:from-slate-900
    group-data-[sleep=true]:via-indigo-950
    group-data-[sleep=true]:to-slate-900'
    >
      {/* Day Mode: Moving Clouds */}
      <CloudSection />
      <HeaderSection />
      <PetSection />
      <ActionButtonSection />
      <TrackingInfoSection />
    </div>
  );
}
