'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { MonthRevenue } from '@/utils/finmindApi';
import { Paper, Typography, Box, Button } from '@mui/material';

interface RevenueChartProps {
  data: MonthRevenue[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.date.substring(0, 7),
    '每月營收（億元）': item.revenue / 100000000, // 单位：亿元
    '單月營收年增率 (%)': item.singleMonthYoY !== null && item.singleMonthYoY !== undefined ? Number(item.singleMonthYoY).toFixed(2) : null,
  })); // 不再反转数据，保持原始顺序，使日期从左到右增加

  // 计算增长率最大最小值
  const growthRates = data
    .map(item => (item.singleMonthYoY !== null && item.singleMonthYoY !== undefined ? Number(item.singleMonthYoY) : null))
    .filter(v => v !== null) as number[];
  const minGrowth = growthRates.length ? Math.floor(Math.min(...growthRates) - 5) : 0;
  const maxGrowth = growthRates.length ? Math.ceil(Math.max(...growthRates) + 5) : 10;

  return (
    <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">每月營收（億元）</Typography>
            <Button variant="contained">近 5 年</Button>
      </Box>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 40, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tickFormatter={(value) => {
              // 只显示每年1月的年份，否则不显示
              const [year, month] = value.split('-');
              return month === '01' ? year : '';
            }}
            interval={0}
            minTickGap={0}
          />
          <YAxis
            yAxisId="left"
            label={{ value: '億元', angle: -90, position: 'insideLeft' }}
            domain={[0, 'dataMax']}
            allowDataOverflow={false}
            tickCount={8}
            tickFormatter={v => Number(v).toFixed(0)}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: '%', angle: -90, position: 'insideRight' }}
            domain={[minGrowth, maxGrowth]}
            allowDataOverflow={false}
            tickCount={8}
            tickFormatter={v => v != null ? Number(v).toFixed(0) : ''}
          />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="每月營收（億元）" fill="#ffc658" />
          <Line yAxisId="right" type="monotone" dataKey="單月營收年增率 (%)" stroke="#ff7300" dot={false} strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default RevenueChart; 