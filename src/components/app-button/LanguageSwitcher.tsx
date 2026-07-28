'use client';

import { useAppRouter } from '@/hooks/useAppRouter';
import { usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Menu, Text } from '@mantine/core';
import { useLocale } from 'next-intl';

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useAppRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: 'en' | 'vi') => {
    // `pathname` is locale-stripped, so a locale switch looks like a same-URL
    // navigation to the progress bar and would be skipped without this.
    router.push(pathname, { locale: newLocale, disableSameURL: false });
  };

  const locales = routing.locales.map((loc) => ({
    value: loc,
    label: loc === 'en' ? 'English' : 'Tiếng Việt',
  }));

  return (
    <Menu shadow='md' width={140} position='bottom-end'>
      <Menu.Target>
        <button className='flex items-center gap-2 px-3 py-2 rounded-lg shadow-md bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer'>
          <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>{locale === 'en' ? 'EN' : 'VI'}</span>
          <svg className='w-4 h-4 text-gray-500 dark:text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </button>
      </Menu.Target>

      <Menu.Dropdown>
        {locales.map((loc) => (
          <Menu.Item
            key={loc.value}
            onClick={() => handleLocaleChange(loc.value)}
            style={{
              fontWeight: locale === loc.value ? 600 : 400,
              backgroundColor: locale === loc.value ? 'var(--mantine-color-blue-light)' : undefined,
            }}
          >
            <Text size='sm'>{loc.label}</Text>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
