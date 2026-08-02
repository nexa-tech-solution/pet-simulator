'use client';

import { isLightMode } from '@/store/theme.store';
import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';

export const ChatFooterSection = () => {
  const t = useTranslations('common');
  const [lightModeAtom] = useAtom(isLightMode);
  return (
    <footer className={`p-4 text-center text-xs transition-colors duration-1000 ${lightModeAtom ? 'text-indigo-500' : 'text-gray-400'}`}>
      <p>© 2026 PetPal AI Chat • {t('poweredBy', { technology: 'Nexa Team' })}</p>
    </footer>
  );
};
