import { useDerivedFinancials } from '../hooks/useDerivedFinancials';
import { useRoleStore } from '../store/roleStore';
import { useTransactionStore } from '../store/transactionStore';
import MetricCards from '../components/dashboard/MetricCards';
import TrendLineChart from '../components/dashboard/TrendLineChart';
import CategoryDonutChart from '../components/dashboard/CategoryDonutChart';
import RecentTransactionsMini from '../components/dashboard/RecentTransactionsMini';
import { Wallet, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

/** Dashboard page with metric cards, charts, and recent activity */
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

  // Empty state — no transactions at all
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-5">
          <Wallet size={36} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Welcome to FinanceIQ
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
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
    <div className="space-y-6">
      {/* Metric cards */}
      <MetricCards
        currentBalance={currentBalance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        transactionCount={visibleTransactions.length}
        incomeDelta={incomeDelta}
        expenseDelta={expenseDelta}
      />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <TrendLineChart monthlyBreakdown={monthlyBreakdown} />
        </div>
        <div className="lg:col-span-2">
          <CategoryDonutChart categoryTotals={categoryTotals} />
        </div>
      </div>

      {/* Recent activity */}
      <RecentTransactionsMini transactions={visibleTransactions} />
    </div>
  );
};

export default DashboardPage;
