'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TextField, Box, Autocomplete, CircularProgress, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface StockOption {
  industry_category: string;
  stock_id: string;
  stock_name: string;
  type: string;
  date: string;
}

interface SearchBarProps {
  onSearch: (stockId: string, stockName: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [options, setOptions] = useState<StockOption[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const stocksRef = useRef<StockOption[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 只加载一次股票列表
  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const res = await fetch('/stocks.json');
        const data = await res.json();
        stocksRef.current = data;
      } catch {
        stocksRef.current = [];
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  // 输入时模糊查找
  useEffect(() => {
    if (!stocksRef.current) return;
    if (!inputValue) {
      setOptions([]);
      return;
    }
    const keyword = inputValue.trim();
    // 先模糊查找
    const rawResult = stocksRef.current.filter(
      s => s.stock_id.includes(keyword) || s.stock_name.includes(keyword)
    );
    // 按stock_id去重
    const uniqueResult: StockOption[] = [];
    const seen = new Set<string>();
    for (const item of rawResult) {
      if (!seen.has(item.stock_id)) {
        uniqueResult.push(item);
        seen.add(item.stock_id);
      }
      if (uniqueResult.length >= 5) break;
    }
    setOptions(uniqueResult);
  }, [inputValue]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Autocomplete
        sx={{ maxWidth: 600, width: '100%' }}
        freeSolo
        loading={loading}
        options={options}
        getOptionLabel={option => typeof option === 'string' ? option : `${option.stock_id} ${option.stock_name}`}
        inputValue={inputValue}
        onInputChange={(_, value) => setInputValue(value)}
        onChange={(_, value) => {
          if (value && typeof value !== 'string') {
            onSearch(value.stock_id, value.stock_name);
            // 选择后自动失去焦点
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.blur();
              }
            }, 100);
          }
        }}
        onFocus={() => {
          // 点击时清除内容
          setInputValue('');
        }}
        disableClearable
        renderInput={params => (
          <TextField
            {...params}
            inputRef={inputRef}
            placeholder="輸入台/美股代號, 查看公司價值"
            variant="outlined"
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: false,
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  <InputAdornment position="end">
                    <SearchIcon color="action" />
                  </InputAdornment>
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        noOptionsText={inputValue ? '未找到匹配' : '請輸入股票代碼或名稱'}
        slotProps={{
          popper: {
            placement: 'bottom-start'
          }
        }}
      />
    </Box>
  );
};

export default SearchBar; 