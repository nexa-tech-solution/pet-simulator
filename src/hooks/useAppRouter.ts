'use client';

import { useRouter as useIntlRouter } from '@/i18n/navigation';
import { useRouter as useProgressRouter } from '@bprogress/next';

/**
 * Locale-aware router that also drives the top loading bar.
 * Use this instead of `useRouter` from `next/navigation` or `@/i18n/navigation`,
 * otherwise programmatic navigation happens without any loading feedback.
 */
export const useAppRouter = () => useProgressRouter({ customRouter: useIntlRouter });
