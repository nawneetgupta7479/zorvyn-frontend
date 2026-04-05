import { Crown, Hash, Calculator, PiggyBank } from 'lucide-react';
import Card from '../ui/Card';
import { formatINR } from '../../utils/currency';
import { categoryConfig } from '../../constants/categoryConfig';
import { cn } from '../../utils/cn';
import type { CategoryTotal, SpendingCategory } from '../../types/finance';

interface InsightTileProps {
  topCategoryByAmount: CategoryTotal | null;
  topCategoryByCount: CategoryTotal | null;
  avgMonthlySpend: number;
  savingsRate: number | null;
}

/** Four insight tiles showing top category, most transactions, avg spend, and savings rate */
const InsightTile = ({ topCategoryByAmount, topCategoryByCount, avgMonthlySpend, savingsRate }: InsightTileProps) => {
  const topConfig = topCategoryByAmount
    ? categoryConfig[topCategoryByAmount.category as SpendingCategory]
    : null;
  const mostConfig = topCategoryByCount
    ? categoryConfig[topCategoryByCount.category as SpendingCategory]
    : null;

  const tiles = [
    {
      label: 'Top Spending Category',
      icon: Crown,
      value: topCategoryByAmount ? topCategoryByAmount.category : 'N/A',
      subValue: topCategoryByAmount ? formatINR(topCategoryByAmount.total) : '',
      badgeColor: topConfig?.color ?? '',
      badgeText: topConfig?.textColor ?? '',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: 'Most Transactions In',
      icon: Hash,
      value: topCategoryByCount ? topCategoryByCount.category : 'N/A',
      subValue: topCategoryByCount ? `${topCategoryByCount.count} transactions` : '',
      badgeColor: mostConfig?.color ?? '',
      badgeText: mostConfig?.textColor ?? '',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Avg Monthly Spend',
      icon: Calculator,
      value: formatINR(avgMonthlySpend),
      subValue: 'per active month',
      badgeColor: '',
      badgeText: '',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Savings Rate',
      icon: PiggyBank,
      value: savingsRate !== null ? `${savingsRate.toFixed(1)}%` : 'N/A',
      subValue: savingsRate !== null ? (savingsRate > 20 ? 'Great!' : savingsRate >= 0 ? 'Could improve' : 'Spending more than earning') : '',
      badgeColor: '',
      badgeText: '',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: savingsRate !== null
        ? savingsRate > 20
          ? 'text-emerald-600 dark:text-emerald-400'
          : savingsRate >= 0
            ? 'text-yellow-600 dark:text-yellow-400'
            : 'text-red-600 dark:text-red-400'
        : 'text-gray-500',
      valueColor: savingsRate !== null
        ? savingsRate > 20
          ? 'text-emerald-600 dark:text-emerald-400'
          : savingsRate >= 0
            ? 'text-yellow-600 dark:text-yellow-400'
            : 'text-red-600 dark:text-red-400'
        : '',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map(({ label, icon: Icon, value, subValue, iconBg, iconColor, valueColor }) => (
        <Card key={label} hover className="animate-slide-up">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {label}
            </p>
            <div className={cn('rounded-xl p-2', iconBg)}>
              <Icon size={18} className={iconColor} />
            </div>
          </div>
          <p className={cn('text-lg font-bold text-gray-900 dark:text-gray-100', valueColor)}>
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subValue}</p>
          )}
        </Card>
      ))}
    </div>
  );
};

export default InsightTile;
