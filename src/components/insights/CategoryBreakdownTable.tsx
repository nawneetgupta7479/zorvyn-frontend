import { useRef } from 'react';
import Card from '../ui/Card';
import { formatINR } from '../../utils/currency';
import { categoryConfig } from '../../constants/categoryConfig';
import { useFadeScaleEntrance } from '../../hooks/useGsapAnimations';
import type { CategoryTotal, SpendingCategory } from '../../types/finance';

interface CategoryBreakdownTableProps {
  categoryTotals: CategoryTotal[];
}

/** Expense category breakdown table with aurora-styled progress bars */
const CategoryBreakdownTable = ({ categoryTotals }: CategoryBreakdownTableProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useFadeScaleEntrance(ref, 0.4);

  const grandTotal = categoryTotals.reduce((sum, c) => sum + c.total, 0);

  if (categoryTotals.length === 0) {
    return (
      <div ref={ref}>
        <Card>
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
            No expense data to display
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-violet-500/40 via-cyan-500/20 to-transparent" />
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Category Breakdown
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">All expense categories ranked by spend</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700/60">
                <th className="py-2.5 px-4 text-left text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-2.5 px-4 text-right text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-2.5 px-4 text-right text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Share
                </th>
                <th className="py-2.5 px-4 text-right text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Txns
                </th>
                <th className="py-2.5 px-4 text-left text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider min-w-[120px]">
                  Distribution
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/30">
              {categoryTotals.map(({ category, total, count }) => {
                const config = categoryConfig[category as SpendingCategory];
                const pct = grandTotal > 0 ? (total / grandTotal) * 100 : 0;

                return (
                  <tr key={category} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${config?.color}`}>
                          {config?.icon && <config.icon size={13} className={config.textColor} />}
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">
                          {category}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-700 dark:text-slate-200 text-sm">
                      {formatINR(total)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 dark:text-slate-500 text-xs font-medium">
                      {pct.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 dark:text-slate-500 text-xs">
                      {count}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700/50 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${Math.min(pct, 100)}%`,
                            backgroundColor: config?.hex ?? '#6b7280',
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CategoryBreakdownTable;
