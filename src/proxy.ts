import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

import { routing } from '@/i18n/routing';

export function proxy(request: NextRequest) {
  const response = createMiddleware(routing)(request);

  return response;
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
