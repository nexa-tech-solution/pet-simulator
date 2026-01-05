'use client';

import { AppProgressProvider as ProgressProvider } from '@bprogress/next';

export function ProgressBarProvider({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider height='2px' color='blue' options={{ showSpinner: false }} shallowRouting>
      {children}
    </ProgressProvider>
  );
}
