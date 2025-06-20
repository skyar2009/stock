import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const FINMIND_API_URL = 'https://api.finmindtrade.com/api/v4/data';
const token = process.env.NEXT_PUBLIC_FINMIND_API_TOKEN;

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
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 