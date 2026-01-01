'use client';

import { createTheme, MantineProvider as Provider } from '@mantine/core';
import React from 'react';

const MantineProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = createTheme({
    fontFamily: 'Satoshi, sans-serif',
    headings: {
      fontFamily: 'Satoshi, sans-serif',
    },
  });

  return (
    <Provider withGlobalClasses withCssVariables withStaticClasses theme={theme}>
      {children}
    </Provider>
  );
};

export default MantineProvider;
