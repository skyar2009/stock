'use client';

import React from 'react';
import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material';
import theme from '@/theme/muiTheme';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#f5f5f5',
        py: 2
      }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Layout; 