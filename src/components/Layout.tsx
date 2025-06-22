'use client';

import React from 'react';
import { ThemeProvider, CssBaseline, Container, Paper } from '@mui/material';
import theme from '@/theme/muiTheme';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper sx={{ 
        width: '100%', 
        py: 2,
        borderRadius: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Paper>
    </ThemeProvider>
  );
};

export default Layout; 