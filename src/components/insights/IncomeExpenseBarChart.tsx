import { useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import Card from '../ui/Card';
import { formatINR, abbreviateINR } from '../../utils/currency';
import { useFadeScaleEntrance } from '../../hooks/useGsapAnimations';
import type { MonthlyBreakdown } from '../../types/finance';

interface IncomeExpenseBarChartProps {
  monthlyBreakdown: MonthlyBreakdown[];
}

/** Grouped bar chart comparing income vs expenses — aurora palette */
const IncomeExpenseBarChart = ({ monthlyBreakdown }: IncomeExpenseBarChartProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useFadeScaleEntrance(ref, 0.25);

  return (
    <div ref={ref}>
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-emerald-500/50 via-rose-500/30 to-transparent" />
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Income vs Expenses
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Monthly comparison</p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyBreakdown} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" strokeOpacity={0.4} />
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
                formatter={(value: any, name: any) => [
                  formatINR(Number(value)),
                  name === 'income' ? 'Income' : 'Expenses',
                ]}
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
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                formatter={(value: string) => (value === 'income' ? 'Income' : 'Expenses')}
              />
              <Bar dataKey="income" fill="#34d399" radius={[6, 6, 0, 0]} barSize={26} />
              <Bar dataKey="expenses" fill="#fb7185" radius={[6, 6, 0, 0]} barSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default IncomeExpenseBarChart;
