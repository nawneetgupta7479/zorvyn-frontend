import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import { formatINR } from '../../utils/currency';
import { categoryConfig } from '../../constants/categoryConfig';
import type { CategoryTotal } from '../../types/finance';
import type { SpendingCategory } from '../../types/finance';

interface CategoryDonutChartProps {
  categoryTotals: CategoryTotal[];
}

/** Donut chart showing expense distribution by category with custom legend */
const CategoryDonutChart = ({ categoryTotals }: CategoryDonutChartProps) => {
  const grandTotal = categoryTotals.reduce((sum, c) => sum + c.total, 0);

  if (categoryTotals.length === 0) {
    return (
      <Card className="animate-slide-up flex items-center justify-center h-full">
        <p className="text-sm text-gray-500 dark:text-gray-400">No expense data available</p>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Spending by Category
      </h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={categoryTotals}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              cornerRadius={4}
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
                backgroundColor: 'var(--tooltip-bg, #fff)',
                border: '1px solid var(--tooltip-border, #e5e7eb)',
                borderRadius: '12px',
                fontSize: '13px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
        {categoryTotals.map((entry) => {
          const config = categoryConfig[entry.category as SpendingCategory];
          const pct = grandTotal > 0 ? ((entry.total / grandTotal) * 100).toFixed(1) : '0';
          return (
            <div key={entry.category} className="flex items-center gap-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: config?.hex ?? '#6b7280' }}
              />
              <span className="text-gray-600 dark:text-gray-400 truncate">{entry.category}</span>
              <span className="ml-auto font-medium text-gray-900 dark:text-gray-100">{pct}%</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CategoryDonutChart;
