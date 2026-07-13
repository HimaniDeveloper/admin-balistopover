'use client';

import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider, styled } from '@mui/material';
import light from '@/styles/themes/light';
import dark from '@/styles/themes/dark';
import { Toast, Spinner } from '@/components';
import store from '@/store';
import '@/styles/globals.css';

const SpinnerContainer = styled('div')(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
}));


function AppContent({ children }) {
  const isDarkMode = useSelector((state) => state.theme?.darkMode);
  const isLoading = useSelector((state) => state.settings?.isLoading);
  const currentTheme = isDarkMode ? dark : light;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Toast />
      {isLoading && (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      )}
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head>
      <body>
        <Provider store={store}>
          <AppContent>{children}</AppContent>
        </Provider>
      </body>
    </html>
  );
}
