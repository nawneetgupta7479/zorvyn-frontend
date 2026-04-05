import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatINR, formatDisplayDate } from '../../utils/currency';
import { categoryConfig } from '../../constants/categoryConfig';
import { cn } from '../../utils/cn';
import { useStaggerEntrance } from '../../hooks/useGsapAnimations';
import type { Transaction, SpendingCategory } from '../../types/finance';

interface RecentTransactionsMiniProps {
  transactions: Transaction[];
}

/** Condensed list of 5 most recent transactions with GSAP staggered reveal */
const RecentTransactionsMini = ({ transactions }: RecentTransactionsMiniProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  useStaggerEntrance(listRef, ':scope > div', 0.3);

  const recent = transactions
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  if (recent.length === 0) {
    return (
      <Card>
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
          No transactions yet
        </p>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-violet-500/40 via-cyan-500/20 to-transparent" />
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Recent Activity
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Last 5 transactions</p>
        </div>
        <Link
          to="/transactions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors group"
        >
          See all
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div ref={listRef} className="space-y-2.5">
        {recent.map((tx) => {
          const config = categoryConfig[tx.category as SpendingCategory];
          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors border border-slate-100 dark:border-slate-700/30"
            >
              {/* Category icon */}
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', config?.color)}>
                {config?.icon && <config.icon size={15} className={config.textColor} />}
              </div>
              <span
                className="flex-1 text-sm text-slate-800 dark:text-slate-100 font-medium truncate"
                title={tx.description}
              >
                {tx.description}
              </span>
              <Badge color={config?.color} textColor={config?.textColor} className="hidden md:inline-flex text-[10px]">
                {tx.category}
              </Badge>
              <div className="text-right shrink-0">
                <span className={cn(
                  'text-sm font-bold',
                  tx.kind === 'income' ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
                )}>
                  {tx.kind === 'income' ? '+' : '−'}{formatINR(tx.amount)}
                </span>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{formatDisplayDate(tx.date)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RecentTransactionsMini;
