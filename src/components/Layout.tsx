'use client';

import React from 'react';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import theme from '@/theme/muiTheme';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </ThemeProvider>
  );
};

export default Layout; 