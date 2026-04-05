import { useRef } from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowLeftRight, ArrowUp, ArrowDown } from 'lucide-react';
import Card from '../ui/Card';
import { formatINR } from '../../utils/currency';
import { cn } from '../../utils/cn';
import { useStaggerEntrance } from '../../hooks/useGsapAnimations';

type DeltaResult = { text: string; trend: 'up' | 'down' | 'flat' | 'none'; value: number | null };

interface MetricCardsProps {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
  incomeDelta: DeltaResult;
  expenseDelta: DeltaResult;
}

/** Four metric cards (2×2 grid) with aurora palette and GSAP staggered entrance */
const MetricCards = ({ currentBalance, totalIncome, totalExpenses, transactionCount, incomeDelta, expenseDelta }: MetricCardsProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  useStaggerEntrance(gridRef, ':scope > div', 0.05);

  const cards = [
    {
      label: 'Current Balance',
      value: formatINR(currentBalance),
      icon: Wallet,
      color: currentBalance >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400',
      iconBg: currentBalance >= 0
        ? 'bg-emerald-500/10 dark:bg-emerald-500/10'
        : 'bg-rose-500/10 dark:bg-rose-500/10',
      accent: currentBalance >= 0
        ? 'from-emerald-500/5 to-transparent dark:from-emerald-500/10 dark:to-transparent'
        : 'from-rose-500/5 to-transparent dark:from-rose-500/10 dark:to-transparent',
      delta: null,
    },
    {
      label: 'Total Income',
      value: formatINR(totalIncome),
      icon: TrendingUp,
      color: 'text-emerald-500 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/10',
      accent: 'from-emerald-500/5 to-transparent dark:from-emerald-500/10 dark:to-transparent',
      delta: incomeDelta,
    },
    {
      label: 'Total Expenses',
      value: formatINR(totalExpenses),
      icon: TrendingDown,
      color: 'text-rose-500 dark:text-rose-400',
      iconBg: 'bg-rose-500/10 dark:bg-rose-500/10',
      accent: 'from-rose-500/5 to-transparent dark:from-rose-500/10 dark:to-transparent',
      delta: expenseDelta,
    },
    {
      label: 'Transactions',
      value: transactionCount.toString(),
      icon: ArrowLeftRight,
      color: 'text-violet-600 dark:text-violet-400',
      iconBg: 'bg-violet-500/10 dark:bg-violet-500/10',
      accent: 'from-violet-500/5 to-transparent dark:from-violet-500/10 dark:to-transparent',
      delta: null,
    },
  ];

  return (
    <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color, iconBg, accent, delta }) => (
        <div key={label}>
          <Card hover className={`bg-gradient-to-br ${accent} relative overflow-hidden`}>
            {/* subtle glow line at top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 dark:via-violet-400/20 to-transparent" />
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 min-w-0">
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {label}
                </p>
                <p className={cn('text-xl lg:text-2xl font-bold tracking-tight', color)}>
                  {value}
                </p>
                {delta && delta.trend !== 'none' && (
                  <p className={cn(
                    'text-[11px] font-medium flex items-center gap-0.5',
                    delta.trend === 'up' ? 'text-emerald-500' : delta.trend === 'down' ? 'text-rose-500' : 'text-slate-400'
                  )}>
                    {delta.trend === 'up' && <ArrowUp size={11} />}
                    {delta.trend === 'down' && <ArrowDown size={11} />}
                    {delta.text}
                  </p>
                )}
              </div>
              <div className={cn('rounded-xl p-2.5 shrink-0', iconBg)}>
                <Icon size={20} className={color} />
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;
