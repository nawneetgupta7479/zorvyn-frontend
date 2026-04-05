import { useRef } from 'react';
import { Target, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import { formatINR } from '../../utils/currency';
import { useFadeScaleEntrance } from '../../hooks/useGsapAnimations';

interface SpendingGoalCardProps {
  totalExpenses: number;
}

const MONTHLY_GOAL = 50000; // ₹50,000 monthly spending goal

/** Spending goal tracker card with animated progress bar */
const SpendingGoalCard = ({ totalExpenses: totalSpent }: SpendingGoalCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useFadeScaleEntrance(ref, 0.45);

  const percentage = Math.min((totalSpent / MONTHLY_GOAL) * 100, 100);
  const remaining = Math.max(MONTHLY_GOAL - totalSpent, 0);
  const isOver = totalSpent > MONTHLY_GOAL;

  const barColor = isOver
    ? 'from-rose-500 to-rose-400'
    : percentage > 80
    ? 'from-amber-500 to-orange-400'
    : 'from-violet-500 to-cyan-400';

  const statusColor = isOver
    ? 'text-rose-500 dark:text-rose-400'
    : percentage > 80
    ? 'text-amber-500 dark:text-amber-400'
    : 'text-emerald-500 dark:text-emerald-400';

  return (
    <div ref={ref}>
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-violet-500/40 via-cyan-400/30 to-transparent" />
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
              Monthly Goal
            </p>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Spending Tracker
            </h3>
          </div>
          <div className={`rounded-xl p-2.5 ${isOver ? 'bg-rose-500/10' : 'bg-violet-500/10'}`}>
            {isOver
              ? <Target size={20} className="text-rose-500 dark:text-rose-400" />
              : <CheckCircle size={20} className="text-violet-600 dark:text-violet-400" />
            }
          </div>
        </div>

        {/* Goal amount */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {formatINR(totalSpent)}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">spent</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            of {formatINR(MONTHLY_GOAL)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold ${statusColor}`}>
            {isOver
              ? `${formatINR(totalSpent - MONTHLY_GOAL)} over budget`
              : `${formatINR(remaining)} left`}
          </span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </Card>
    </div>
  );
};

export default SpendingGoalCard;
