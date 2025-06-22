'use client';

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import StockInfo from '@/components/StockInfo';
import RevenueChart from '@/components/RevenueChart';
import RevenueTable from '@/components/RevenueTable';
import { fetchMonthRevenue, MonthRevenue } from '@/utils/finmindApi';

export default function Home() {
  const [data, setData] = useState<MonthRevenue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedStockId, setSearchedStockId] = useState<string>('');
  const [searchedStockName, setSearchedStockName] = useState<string>('');

  const handleSearch = async (stockId: string, stockName: string) => {
    if (!stockId) {
      setError('請輸入股票代碼');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetchMonthRevenue(stockId);
      if (response.data && response.data.length > 0) {
        // 计算单月营收年增长率
        const dataWithYoY = response.data.map((item, idx, arr) => {
          // 找到去年同月
          const lastYear = new Date(item.date);
          lastYear.setFullYear(lastYear.getFullYear() - 1);
          const lastYearMonth = lastYear.toISOString().slice(0, 7);
          const lastYearItem = arr.find(i => i.date.slice(0, 7) === lastYearMonth);
          let singleMonthYoY = null;
          if (lastYearItem && lastYearItem.revenue) {
            singleMonthYoY = ((item.revenue / lastYearItem.revenue - 1) * 100);
          }
          return { ...item, singleMonthYoY };
        });
        // 只保留最近5年（60个月）
        const last60 = dataWithYoY.slice(-60);
        setData(last60);
        setSearchedStockId(stockId);
        setSearchedStockName(stockName);
      } else {
        setError('找不到該股票代碼的資料');
        setData([]);
      }
    } catch {
      setError('獲取資料時發生錯誤');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时自动搜索2330的数据
  useEffect(() => {
    handleSearch('2330', '台積電');
  }, []);

  return (
    <Layout>
      <SearchBar
        onSearch={handleSearch}
      />
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      {data.length > 0 && (
        <>
          <StockInfo stockId={searchedStockId} stockName={searchedStockName} />
          <RevenueChart data={data} />
          <RevenueTable data={data} />
        </>
      )}
    </Layout>
  );
}
