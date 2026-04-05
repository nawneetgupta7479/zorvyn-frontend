import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatINR, formatDisplayDate } from '../../utils/currency';
import { categoryConfig } from '../../constants/categoryConfig';
import { cn } from '../../utils/cn';
import type { Transaction, SpendingCategory } from '../../types/finance';

interface RecentTransactionsMiniProps {
  transactions: Transaction[];
}

/** Condensed list of the 5 most recent transactions with a "See all" link */
const RecentTransactionsMini = ({ transactions }: RecentTransactionsMiniProps) => {
  const recent = transactions
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  if (recent.length === 0) {
    return (
      <Card className="animate-slide-up">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No transactions yet
        </p>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Recent Activity
        </h3>
        <Link
          to="/transactions"
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
        >
          See all transactions
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-3">
        {recent.map((tx) => {
          const config = categoryConfig[tx.category as SpendingCategory];
          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap bg-gray-200 dark:bg-gray-700 rounded-lg px-2 py-1">
                {formatDisplayDate(tx.date)}
              </span>
              <span
                className="flex-1 text-sm text-gray-900 dark:text-gray-100 truncate"
                title={tx.description}
              >
                {tx.description}
              </span>
              <Badge color={config?.color} textColor={config?.textColor} className="hidden sm:inline-flex">
                {tx.category}
              </Badge>
              <span
                className={cn(
                  'text-sm font-semibold whitespace-nowrap',
                  tx.kind === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                )}
              >
                {tx.kind === 'income' ? '+' : '-'}{formatINR(tx.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RecentTransactionsMini;
