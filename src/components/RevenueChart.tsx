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
import { Paper, Box, Button } from '@mui/material';

interface RevenueChartProps {
  data: MonthRevenue[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.date.substring(0, 7),
    '每月營收（億元）': item.revenue / 100000000, // 单位：亿元
    '單月營收年增率 (%)': item.singleMonthYoY !== null && item.singleMonthYoY !== undefined ? Number(item.singleMonthYoY).toFixed(2) : null,
  })); // 不再反转数据，保持原始顺序，使日期从左到右增加

  // 计算营收最大值
  const revenues = chartData.map(item => item['每月營收（億元）']);
  const maxRevenue = Math.max(...revenues);
  
  // 计算合适的Y轴最大值：向上取整到合适的整数
  const calculateMaxYAxis = (maxValue: number) => {
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
    const normalized = maxValue / magnitude;
    let roundedUp;
    
    if (normalized <= 1) roundedUp = 1;
    else if (normalized <= 2) roundedUp = 2;
    else if (normalized <= 5) roundedUp = 5;
    else roundedUp = 10;
    
    return Math.ceil(roundedUp * magnitude * 1.1); // 额外增加10%的空间
  };
  
  const maxYAxis = calculateMaxYAxis(maxRevenue);

  // 生成均匀的Y轴刻度
  const generateUniformTicks = (min: number, max: number, count: number = 6) => {
    const step = (max - min) / (count - 1);
    const ticks = [];
    for (let i = 0; i < count; i++) {
      ticks.push(Math.round((min + i * step) * 100) / 100);
    }
    return ticks;
  };

  // 计算增长率最大最小值
  const growthRates = data
    .map(item => (item.singleMonthYoY !== null && item.singleMonthYoY !== undefined ? Number(item.singleMonthYoY) : null))
    .filter(v => v !== null) as number[];
  const minGrowth = growthRates.length ? Math.floor(Math.min(...growthRates) - 5) : 0;
  const maxGrowth = growthRates.length ? Math.ceil(Math.max(...growthRates) + 5) : 10;

  // 生成均匀的刻度
  const revenueTicks = generateUniformTicks(0, maxYAxis, 6);
  const growthTicks = generateUniformTicks(minGrowth, maxGrowth, 6);

  // 只取所有01月份的name作为X轴刻度
  const xAxisTicks = chartData
    .filter(item => item.name.endsWith('-01'))
    .map(item => item.name);

  return (
    <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button variant="contained">每月營收</Button>
            <Button variant="contained">近 5 年</Button>
      </Box>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 40, left: 20, bottom: 5 }}>
          <CartesianGrid />
          <XAxis
            dataKey="name"
            ticks={xAxisTicks}
            tickFormatter={(value) => {
              const [year, month] = value.split('-');
              return month === '01' ? year : '';
            }}
            minTickGap={0}
            allowDataOverflow={false}
          />
          <YAxis
            yAxisId="left"
            domain={[0, maxYAxis]}
            allowDataOverflow={false}
            ticks={revenueTicks}
            tickFormatter={v => v === maxYAxis ? '元' : Number(v).toFixed(0) + ' 億'}
            axisLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[minGrowth, maxGrowth]}
            allowDataOverflow={false}
            ticks={growthTicks}
            tickFormatter={v => v === maxGrowth ? '%' : (v != null ? Number(v).toFixed(0) : '')}
            axisLine={false}
          />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="每月營收（億元）" fill="#ffc658" />
          <Line yAxisId="right" type="monotone" dataKey="單月營收年增率 (%)" stroke="#d32f2f" dot={false} strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default RevenueChart; 