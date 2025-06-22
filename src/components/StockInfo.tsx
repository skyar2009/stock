'use client';

import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

interface StockInfoProps {
  stockId: string;
  stockName?: string;
}

const StockInfo: React.FC<StockInfoProps> = ({ stockId, stockName }) => {
  if (!stockId) return null;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h4" component="h1">
        {stockName ? `${stockName} (${stockId})` : stockId}
      </Typography>
    </Paper>
  );
};

export default StockInfo; 