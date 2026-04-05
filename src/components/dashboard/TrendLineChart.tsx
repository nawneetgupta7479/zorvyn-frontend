import { useRef, useMemo } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import Card from '../ui/Card';
import { formatINR, abbreviateINR } from '../../utils/currency';
import { useFadeScaleEntrance } from '../../hooks/useGsapAnimations';
import type { MonthlyBreakdown } from '../../types/finance';

interface TrendLineChartProps {
  monthlyBreakdown: MonthlyBreakdown[];
}

interface CumulativePoint {
  month: string;
  balance: number;
}

/** Balance trend area chart — violet+cyan aurora palette */
const TrendLineChart = ({ monthlyBreakdown }: TrendLineChartProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useFadeScaleEntrance(ref, 0.2);

  const data = useMemo<CumulativePoint[]>(() => {
    let running = 0;
    return monthlyBreakdown.map(({ month, income, expenses }) => {
      running += income - expenses;
      return { month, balance: running };
    });
  }, [monthlyBreakdown]);

  return (
    <div ref={ref}>
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-violet-500/50 via-cyan-500/30 to-transparent" />
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Balance Trend
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Cumulative running balance</p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-800/50">
            All Time
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" strokeOpacity={0.5} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={abbreviateINR}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip
                formatter={(value: any) => [formatINR(Number(value)), 'Balance']}
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #1f2937',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  color: '#f1f5f9',
                }}
                labelStyle={{ fontWeight: 600, marginBottom: 4, color: '#a78bfa' }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="url(#strokeGradient)"
                strokeWidth={2.5}
                fill="url(#balanceGradient)"
                dot={{ fill: '#7c3aed', r: 3.5, strokeWidth: 2, stroke: '#0d1117' }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: '#7c3aed', fill: '#c4b5fd' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default TrendLineChart;
