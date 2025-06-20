'use client';

import React, { useRef, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button
} from '@mui/material';
import { MonthRevenue } from '@/utils/finmindApi';
import { styled } from '@mui/material/styles';

interface RevenueTableProps {
  data: MonthRevenue[];
}

// 自定义样式组件，实现首列锁定和表格滑动
const StyledTableContainer = styled(TableContainer)({
  width: '100%',
  overflowX: 'auto',
  '& .sticky-column': {
    position: 'sticky',
    left: 0,
    zIndex: 1,
    boxShadow: '2px 0px 3px rgba(0,0,0,0.1)',
    minWidth: 110,
    width: 110,
  }
});

const RevenueTable: React.FC<RevenueTableProps> = ({ data }) => {
  // 按日期排序，确保日期从左到右增加
  const sortedData = [...data].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 取最近60个月的数据
  const recentData = sortedData.slice(-60);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data]);

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2 }}>
        <Button variant="contained">詳細數據</Button>
      </Box>
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <StyledTableContainer sx={{ width: '100%' }} ref={scrollRef}>
          <Table sx={{ minWidth: 1200, width: '100%', borderCollapse: 'separate', borderSpacing: 0 }} aria-label="revenue table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell className="sticky-column" sx={{ backgroundColor: '#f5f5f5', borderRight: '1px solid #e0e0e0' }}>年度/月份</TableCell>
                {recentData.map((item, idx) => (
                  <TableCell key={item.date} align="right" sx={{ borderRight: idx === recentData.length - 1 ? 0 : '1px solid #e0e0e0' }}>{item.date.substring(0, 7).replace('-', '')}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {([
                ['每月營收（億元）', (item: MonthRevenue) => (item.revenue / 100000000).toFixed(2)],
                ['單月營收年增率 (%)', (item: MonthRevenue) => (item.singleMonthYoY !== null && item.singleMonthYoY !== undefined ? item.singleMonthYoY.toFixed(2) : '-')],
              ] as [string, (item: MonthRevenue) => string][]).map(([label, render], idx) => (
                <TableRow key={label} sx={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f5f5f5' }}>
                  <TableCell
                    component="th"
                    scope="row"
                    className="sticky-column"
                    sx={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f5f5f5', borderRight: '1px solid #e0e0e0' }}
                  >
                    {label}
                  </TableCell>
                  {recentData.map((item, colIdx) => (
                    <TableCell key={item.date} align="right" sx={{ borderRight: colIdx === recentData.length - 1 ? 0 : '1px solid #e0e0e0' }}>{render(item)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Box>
      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Typography variant="caption" color="textSecondary">
          圖表單位：億元，數據來自公開資訊觀測站
        </Typography>
        <br />
        <Typography variant="caption" color="textSecondary">
          網頁圖表歡迎轉貼引用，請註明出處為財報狗
        </Typography>
      </Box>
    </Paper>
  );
};

export default RevenueTable; 