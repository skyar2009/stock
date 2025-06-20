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
  const res = await fetch(`/api/finmind?stockId=${stockId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch month revenue');
  }
  return res.json();
}; 