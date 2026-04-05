import { useDerivedFinancials } from '../hooks/useDerivedFinancials';
import { useRoleStore } from '../store/roleStore';
import { useTransactionStore } from '../store/transactionStore';
import MetricCards from '../components/dashboard/MetricCards';
import TrendLineChart from '../components/dashboard/TrendLineChart';
import CategoryDonutChart from '../components/dashboard/CategoryDonutChart';
import RecentTransactionsMini from '../components/dashboard/RecentTransactionsMini';
import SpendingGoalCard from '../components/dashboard/SpendingGoalCard';
import { Zap, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

/** Dashboard page — repositioned layout with 4 metric cards, reversed chart order, and spending goal */
const DashboardPage = () => {
  const {
    visibleTransactions,
    totalIncome,
    totalExpenses,
    currentBalance,
    monthlyBreakdown,
    categoryTotals,
    incomeDelta,
    expenseDelta,
  } = useDerivedFinancials();

  const transactions = useTransactionStore((s) => s.transactions);
  const activeRole = useRoleStore((s) => s.activeRole);
  const navigate = useNavigate();

  // Empty state
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: 'linear-gradient(135deg, #7c3aed20, #06b6d420)' }}>
          <Zap size={36} className="text-violet-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Welcome to <span className="gradient-text">Zorvyn Finance</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">
          {activeRole === 'admin'
            ? 'Start tracking your finances by adding your first transaction.'
            : 'No transactions recorded yet. Ask an admin to add some entries.'}
        </p>
        {activeRole === 'admin' && (
          <Button onClick={() => navigate('/transactions')}>
            <Plus size={16} />
            Add First Transaction
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Metric cards — 4-column on lg */}
      <MetricCards
        currentBalance={currentBalance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        transactionCount={visibleTransactions.length}
        incomeDelta={incomeDelta}
        expenseDelta={expenseDelta}
      />

      {/* Charts row — Donut LEFT (2/5), Trend RIGHT (3/5) — reversed from original */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2">
          <CategoryDonutChart categoryTotals={categoryTotals} />
        </div>
        <div className="lg:col-span-3">
          <TrendLineChart monthlyBreakdown={monthlyBreakdown} />
        </div>
      </div>

      {/* Bottom row — Recent activity + Spending goal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentTransactionsMini transactions={visibleTransactions} />
        </div>
        <div className="lg:col-span-1">
          <SpendingGoalCard totalExpenses={totalExpenses} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
