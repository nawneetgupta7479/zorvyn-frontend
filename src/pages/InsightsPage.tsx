import { useDerivedFinancials } from '../hooks/useDerivedFinancials';
import InsightTile from '../components/insights/InsightTile';
import IncomeExpenseBarChart from '../components/insights/IncomeExpenseBarChart';
import CategoryBreakdownTable from '../components/insights/CategoryBreakdownTable';

/** Insights page with KPI tiles, income/expense bar chart, and category breakdown */
const InsightsPage = () => {
  const {
    monthlyBreakdown,
    categoryTotals,
    savingsRate,
    avgMonthlySpend,
    topCategoryByAmount,
    topCategoryByCount,
  } = useDerivedFinancials();

  return (
    <div className="space-y-6">
      {/* Insight tiles */}
      <InsightTile
        topCategoryByAmount={topCategoryByAmount}
        topCategoryByCount={topCategoryByCount}
        avgMonthlySpend={avgMonthlySpend}
        savingsRate={savingsRate}
      />

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
