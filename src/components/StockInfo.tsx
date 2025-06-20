'use client';

import React from 'react';
import { Typography, Box } from '@mui/material';

interface StockInfoProps {
  stockId: string;
  stockName?: string;
}

const StockInfo: React.FC<StockInfoProps> = ({ stockId, stockName }) => {
  if (!stockId) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h4" component="h1">
        {stockName ? `${stockName} (${stockId})` : stockId}
      </Typography>
    </Box>
  );
};

export default StockInfo; 