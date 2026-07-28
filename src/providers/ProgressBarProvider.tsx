'use client';

import { AppProgressProvider as ProgressProvider } from '@bprogress/next';

export function ProgressBarProvider({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider height='3px' color='#3b82f6' startPosition={0.15} options={{ showSpinner: false }} shallowRouting>
      {children}
    </ProgressProvider>
  );
}
