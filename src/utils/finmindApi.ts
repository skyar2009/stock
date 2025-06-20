import axios from 'axios';

const FINMIND_API_URL = 'https://api.finmindtrade.com/api/v4/data';
const token = process.env.NEXT_PUBLIC_FINMIND_API_TOKEN;
export interface MonthRevenue {
  date: string;
  stock_id: string;
  country: string;
  revenue: number;
  revenue_month: number;
  revenue_year: number;
  "年月": string;
  "當月營收": number;
  "上月比較增減(%)": number;
  "去年同月增減(%)": number;
  "當月累計營收": number;
  "去年累計增減(%)": number;
  "備註": string;
  singleMonthYoY?: number | null;
}

export interface FinMindResponse {
  msg: string;
  status: number;
  data: MonthRevenue[];
}

export const fetchMonthRevenue = async (stockId: string): Promise<FinMindResponse> => {
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
    return response.data;
  } catch (error) {
    console.error("Error fetching month revenue:", error);
    throw error;
  }
}; 