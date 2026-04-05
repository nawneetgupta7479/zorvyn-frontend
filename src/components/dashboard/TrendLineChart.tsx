import { useMemo } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import Card from '../ui/Card';
import { formatINR, abbreviateINR } from '../../utils/currency';
import type { MonthlyBreakdown } from '../../types/finance';

interface TrendLineChartProps {
  monthlyBreakdown: MonthlyBreakdown[];
}

interface CumulativePoint {
  month: string;
  balance: number;
}

/** Balance trend area chart showing cumulative running balance across months */
const TrendLineChart = ({ monthlyBreakdown }: TrendLineChartProps) => {
  const data = useMemo<CumulativePoint[]>(() => {
    let running = 0;
    return monthlyBreakdown.map(({ month, income, expenses }) => {
      running += income - expenses;
      return { month, balance: running };
    });
  }, [monthlyBreakdown]);

  return (
    <Card className="animate-slide-up">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Balance Trend
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200, #e5e7eb)" strokeOpacity={0.5} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={abbreviateINR}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip
              formatter={(value: any) => [formatINR(Number(value)), 'Balance']}
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg, #fff)',
                border: '1px solid var(--tooltip-border, #e5e7eb)',
                borderRadius: '12px',
                fontSize: '13px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#balanceGradient)"
              dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TrendLineChart;
