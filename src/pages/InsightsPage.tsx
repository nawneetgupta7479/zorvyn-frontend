import { useDerivedFinancials } from '../hooks/useDerivedFinancials';
import InsightTile from '../components/insights/InsightTile';
import IncomeExpenseBarChart from '../components/insights/IncomeExpenseBarChart';
import CategoryBreakdownTable from '../components/insights/CategoryBreakdownTable';
import Card from '../components/ui/Card';
import { formatINR } from '../utils/currency';
import { TrendingDown, TrendingUp, Info } from 'lucide-react';
import { useRoleStore } from '../store/roleStore';

/** Insights page with KPI tiles, income/expense bar chart, category breakdown, and monthly comparison */
const InsightsPage = () => {
  const {
    monthlyBreakdown,
    categoryTotals,
    savingsRate,
    avgMonthlySpend,
    topCategoryByAmount,
    topCategoryByCount,
    totalIncome,
    totalExpenses,
  } = useDerivedFinancials();

  const activeRole = useRoleStore((s) => s.activeRole);

  // Monthly comparison: last 2 months
  const lastTwo = monthlyBreakdown.filter((m) => m.income > 0 || m.expenses > 0).slice(-2);
  const prevMonth = lastTwo.length >= 2 ? lastTwo[0] : null;
  const currMonth = lastTwo.length >= 2 ? lastTwo[1] : lastTwo[0] ?? null;
  const expenseDiff = currMonth && prevMonth ? currMonth.expenses - prevMonth.expenses : null;
  const incomeDiff = currMonth && prevMonth ? currMonth.income - prevMonth.income : null;

  return (
    <div className="space-y-5">
      {/* Viewer mode note */}
      {activeRole === 'viewer' && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-cyan-200 dark:border-cyan-700/40 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 text-sm animate-slide-up">
          <Info size={16} className="shrink-0 mt-0.5" />
          <span><strong>Viewer mode</strong> — You are viewing insights in read-only mode. All data analysis is available to you.</span>
        </div>
      )}

      {/* Insight tiles */}
      <InsightTile
        topCategoryByAmount={topCategoryByAmount}
        topCategoryByCount={topCategoryByCount}
        avgMonthlySpend={avgMonthlySpend}
        savingsRate={savingsRate}
      />

      {/* Monthly comparison panel */}
      {currMonth && (
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-violet-500/40 via-cyan-400/20 to-transparent" />
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Monthly Comparison</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {prevMonth ? `${prevMonth.month} vs ${currMonth.month}` : `${currMonth.month} overview`}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Current income */}
            <div className="rounded-xl p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40">
              <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-widest mb-1">
                {currMonth.month} Income
              </p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatINR(currMonth.income)}</p>
              {incomeDiff !== null && (
                <p className={`text-xs font-medium flex items-center gap-0.5 mt-0.5 ${incomeDiff >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {incomeDiff >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {formatINR(Math.abs(incomeDiff))} vs prev
                </p>
              )}
            </div>
            {/* Current expenses */}
            <div className="rounded-xl p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-800/40">
              <p className="text-[10px] font-semibold text-rose-500 uppercase tracking-widest mb-1">
                {currMonth.month} Expenses
              </p>
              <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{formatINR(currMonth.expenses)}</p>
              {expenseDiff !== null && (
                <p className={`text-xs font-medium flex items-center gap-0.5 mt-0.5 ${expenseDiff <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {expenseDiff <= 0 ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
                  {formatINR(Math.abs(expenseDiff))} vs prev
                </p>
              )}
            </div>
            {/* Net savings */}
            <div className="rounded-xl p-3 bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-800/40">
              <p className="text-[10px] font-semibold text-violet-500 uppercase tracking-widest mb-1">Overall Net</p>
              <p className={`text-lg font-bold ${totalIncome > totalExpenses ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                {formatINR(totalIncome - totalExpenses)}
              </p>
              <p className="text-xs text-violet-400 dark:text-violet-500 mt-0.5">Income − Expenses</p>
            </div>
            {/* Savings rate */}
            <div className="rounded-xl p-3 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-800/40">
              <p className="text-[10px] font-semibold text-cyan-500 uppercase tracking-widest mb-1">Savings Rate</p>
              <p className={`text-lg font-bold ${savingsRate !== null && savingsRate > 20 ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}>
                {savingsRate !== null ? `${savingsRate.toFixed(1)}%` : 'N/A'}
              </p>
              <p className="text-xs text-cyan-400 dark:text-cyan-500 mt-0.5">
                {savingsRate !== null && savingsRate > 20 ? '🎉 Great!' : savingsRate !== null && savingsRate >= 0 ? '⚡ Could improve' : '⚠️ Deficit'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Income vs Expense chart */}
      <IncomeExpenseBarChart
        monthlyBreakdown={monthlyBreakdown.filter((m) => m.income > 0 || m.expenses > 0)}
      />

      {/* Category breakdown table */}
      <CategoryBreakdownTable categoryTotals={categoryTotals} />
    </div>
  );
};

export default InsightsPage;
