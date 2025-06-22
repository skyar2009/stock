import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const FINMIND_API_URL = 'https://api.finmindtrade.com/api/v4/data';
const token = process.env.NEXT_PUBLIC_FINMIND_API_TOKEN;

// 修正月份偏差的函数
const adjustMonth = (dateStr: string): string => {
  const [year, month] = dateStr.split('-');
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);
  
  let adjustedYear = yearNum;
  let adjustedMonth = monthNum - 1;
  
  if (adjustedMonth === 0) {
    adjustedMonth = 12;
    adjustedYear = yearNum - 1;
  }
  
  return `${adjustedYear}-${adjustedMonth.toString().padStart(2, '0')}`;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stockId = searchParams.get('stockId');
  if (!stockId) {
    return NextResponse.json({ error: 'Missing stockId' }, { status: 400 });
  }

  const today = new Date();
  const sixYearsAgo = new Date(today.getFullYear() - 6, today.getMonth(), today.getDate());

  const params = {
    dataset: 'TaiwanStockMonthRevenue',
    data_id: stockId,
    start_date: sixYearsAgo.toISOString().split('T')[0],
    end_date: today.toISOString().split('T')[0],
  };

  try {
    const response = await axios.get(FINMIND_API_URL, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // 修正返回数据中的月份
    const adjustedData = response.data.data.map((item: any) => ({
      ...item,
      date: adjustMonth(item.date)
    }));
    
    return NextResponse.json({
      ...response.data,
      data: adjustedData
    });
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 