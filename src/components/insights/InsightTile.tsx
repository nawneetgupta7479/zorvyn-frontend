import { useRef } from 'react';
import { Crown, Hash, Calculator, TrendingDown, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import { formatINR } from '../../utils/currency';
import { categoryConfig } from '../../constants/categoryConfig';
import { cn } from '../../utils/cn';
import { useStaggerEntrance } from '../../hooks/useGsapAnimations';
import type { CategoryTotal, SpendingCategory } from '../../types/finance';

interface InsightTileProps {
  topCategoryByAmount: CategoryTotal | null;
  topCategoryByCount: CategoryTotal | null;
  avgMonthlySpend: number;
  savingsRate: number | null;
}

/** Four insight tiles with aurora palette and GSAP staggered entrance */
const InsightTile = ({ topCategoryByAmount, topCategoryByCount, avgMonthlySpend, savingsRate }: InsightTileProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  useStaggerEntrance(gridRef, ':scope > div', 0.05);

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
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/10',
      iconColor: 'text-amber-500 dark:text-amber-400',
      accent: 'from-amber-500/5 to-transparent dark:from-amber-500/8 dark:to-transparent',
      valueStyle: topConfig?.textColor ?? 'text-slate-800 dark:text-slate-100',
    },
    {
      label: 'Most Transactions In',
      icon: Hash,
      value: topCategoryByCount ? topCategoryByCount.category : 'N/A',
      subValue: topCategoryByCount ? `${topCategoryByCount.count} transactions` : '',
      iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/10',
      iconColor: 'text-cyan-500 dark:text-cyan-400',
      accent: 'from-cyan-500/5 to-transparent dark:from-cyan-500/8 dark:to-transparent',
      valueStyle: mostConfig?.textColor ?? 'text-slate-800 dark:text-slate-100',
    },
    {
      label: 'Avg Monthly Spend',
      icon: Calculator,
      value: formatINR(avgMonthlySpend),
      subValue: 'per active month',
      iconBg: 'bg-violet-500/10 dark:bg-violet-500/10',
      iconColor: 'text-violet-600 dark:text-violet-400',
      accent: 'from-violet-500/5 to-transparent dark:from-violet-500/8 dark:to-transparent',
      valueStyle: 'text-slate-800 dark:text-slate-100',
    },
    {
      label: 'Savings Rate',
      icon: savingsRate !== null && savingsRate > 0 ? TrendingUp : TrendingDown,
      value: savingsRate !== null ? `${savingsRate.toFixed(1)}%` : 'N/A',
      subValue: savingsRate !== null ? (savingsRate > 20 ? '🎉 Excellent saving!' : savingsRate >= 0 ? '⚡ Could improve' : '⚠️ Overspending') : '',
      iconBg: savingsRate !== null && savingsRate > 20 ? 'bg-emerald-500/10' : 'bg-rose-500/10',
      iconColor: savingsRate !== null
        ? savingsRate > 20 ? 'text-emerald-500 dark:text-emerald-400' : savingsRate >= 0 ? 'text-amber-500 dark:text-amber-400' : 'text-rose-500 dark:text-rose-400'
        : 'text-slate-400',
      accent: 'from-emerald-500/5 to-transparent dark:from-emerald-500/8 dark:to-transparent',
      valueStyle: savingsRate !== null
        ? savingsRate > 20
          ? 'text-emerald-500 dark:text-emerald-400'
          : savingsRate >= 0
            ? 'text-amber-500 dark:text-amber-400'
            : 'text-rose-500 dark:text-rose-400'
        : 'text-slate-400',
    },
  ];

  return (
    <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map(({ label, icon: Icon, value, subValue, iconBg, iconColor, accent, valueStyle }) => (
        <div key={label}>
          <Card hover className={`relative overflow-hidden bg-gradient-to-br ${accent}`}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/20 dark:via-violet-400/15 to-transparent" />
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">
                {label}
              </p>
              <div className={cn('rounded-xl p-2 shrink-0', iconBg)}>
                <Icon size={17} className={iconColor} />
              </div>
            </div>
            <p className={cn('text-lg font-bold tracking-tight', valueStyle)}>
              {value}
            </p>
            {subValue && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subValue}</p>
            )}
          </Card>
        </div>
      ))}
    </div>
  );
};

export default InsightTile;
