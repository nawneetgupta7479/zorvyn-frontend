import { Wallet, TrendingUp, TrendingDown, ArrowLeftRight, ArrowUp, ArrowDown } from 'lucide-react';
import Card from '../ui/Card';
import { formatINR } from '../../utils/currency';
import { cn } from '../../utils/cn';

type DeltaResult = { text: string; trend: 'up' | 'down' | 'flat' | 'none'; value: number | null };

interface MetricCardsProps {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
  incomeDelta: DeltaResult;
  expenseDelta: DeltaResult;
}

/** Four metric cards showing key financial KPIs with delta indicators */
const MetricCards = ({ currentBalance, totalIncome, totalExpenses, transactionCount, incomeDelta, expenseDelta }: MetricCardsProps) => {

  const cards = [
    {
      label: 'Current Balance',
      value: formatINR(currentBalance),
      icon: Wallet,
      color: currentBalance >= 0
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-red-600 dark:text-red-400',
      iconBg: currentBalance >= 0
        ? 'bg-emerald-100 dark:bg-emerald-900/30'
        : 'bg-red-100 dark:bg-red-900/30',
      delta: null,
    },
    {
      label: 'Total Income',
      value: formatINR(totalIncome),
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      delta: incomeDelta,
    },
    {
      label: 'Total Expenses',
      value: formatINR(totalExpenses),
      icon: TrendingDown,
      color: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-100 dark:bg-rose-900/30',
      delta: expenseDelta,
    },
    {
      label: 'Transactions',
      value: transactionCount.toString(),
      icon: ArrowLeftRight,
      color: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
      delta: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color, iconBg, delta }) => (
        <Card key={label} hover className="animate-slide-up">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {label}
              </p>
              <p className={cn('text-xl lg:text-2xl font-bold', color)}>
                {value}
              </p>
              {delta && delta.trend !== 'none' && (
                <p
                  className={cn(
                    'text-xs font-medium flex items-center',
                    delta.trend === 'up' ? 'text-emerald-500' : delta.trend === 'down' ? 'text-rose-500' : 'text-gray-500'
                  )}
                >
                  {delta.trend === 'up' && <ArrowUp size={12} className="mr-0.5" />}
                  {delta.trend === 'down' && <ArrowDown size={12} className="mr-0.5" />}
                  {delta.text}
                </p>
              )}
            </div>
            <div className={cn('rounded-xl p-2.5', iconBg)}>
              <Icon size={20} className={color} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MetricCards;
