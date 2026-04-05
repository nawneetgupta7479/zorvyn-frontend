import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import Card from '../ui/Card';
import { formatINR, abbreviateINR } from '../../utils/currency';
import type { MonthlyBreakdown } from '../../types/finance';

interface IncomeExpenseBarChartProps {
  monthlyBreakdown: MonthlyBreakdown[];
}

/** Grouped bar chart comparing income vs expenses over last 6 months */
const IncomeExpenseBarChart = ({ monthlyBreakdown }: IncomeExpenseBarChartProps) => {
  return (
    <Card className="animate-slide-up">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Income vs Expense Over Time
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyBreakdown} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.4} />
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
              formatter={(value: any, name: any) => [
                formatINR(Number(value)),
                name === 'income' ? 'Income' : 'Expenses',
              ]}
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg, #fff)',
                border: '1px solid var(--tooltip-border, #e5e7eb)',
                borderRadius: '12px',
                fontSize: '13px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value: string) => (value === 'income' ? 'Income' : 'Expenses')}
            />
            <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} barSize={28} />
            <Bar dataKey="expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default IncomeExpenseBarChart;
