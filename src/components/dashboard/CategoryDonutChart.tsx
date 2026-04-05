import { useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import { formatINR } from '../../utils/currency';
import { categoryConfig } from '../../constants/categoryConfig';
import { useFadeScaleEntrance } from '../../hooks/useGsapAnimations';
import type { CategoryTotal } from '../../types/finance';
import type { SpendingCategory } from '../../types/finance';

interface CategoryDonutChartProps {
  categoryTotals: CategoryTotal[];
}

/** Donut chart with aurora palette — spending by category */
const CategoryDonutChart = ({ categoryTotals }: CategoryDonutChartProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useFadeScaleEntrance(ref, 0.35);

  const grandTotal = categoryTotals.reduce((sum, c) => sum + c.total, 0);

  if (categoryTotals.length === 0) {
    return (
      <div ref={ref}>
        <Card className="flex items-center justify-center h-full min-h-[280px]">
          <p className="text-sm text-slate-400 dark:text-slate-500">No expense data available</p>
        </Card>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <Card className="relative overflow-hidden h-full">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-500/50 via-violet-500/30 to-transparent" />
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Spending by Category
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Expense breakdown</p>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryTotals}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={82}
                paddingAngle={3}
                cornerRadius={5}
              >
                {categoryTotals.map((entry) => {
                  const config = categoryConfig[entry.category as SpendingCategory];
                  return (
                    <Cell
                      key={entry.category}
                      fill={config?.hex ?? '#6b7280'}
                      strokeWidth={0}
                    />
                  );
                })}
              </Pie>
              <Tooltip
                formatter={(value: any) => formatINR(Number(value))}
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #1f2937',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  color: '#f1f5f9',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3">
          {categoryTotals.slice(0, 6).map((entry) => {
            const config = categoryConfig[entry.category as SpendingCategory];
            const pct = grandTotal > 0 ? ((entry.total / grandTotal) * 100).toFixed(1) : '0';
            return (
              <div key={entry.category} className="flex items-center gap-2 text-[11px]">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: config?.hex ?? '#6b7280' }}
                />
                <span className="text-slate-500 dark:text-slate-400 truncate flex-1">{entry.category}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200 ml-auto">{pct}%</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default CategoryDonutChart;
