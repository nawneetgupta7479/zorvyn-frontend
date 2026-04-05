import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useDerivedFinancials } from '../hooks/useDerivedFinancials';
import { useRoleStore } from '../store/roleStore';
import TransactionList from '../components/transactions/TransactionList';
import FilterToolbar from '../components/transactions/FilterToolbar';
import TransactionFormModal from '../components/transactions/TransactionFormModal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import type { Transaction } from '../types/finance';

/** Transactions page with filter toolbar, data table, and add/edit modal */
const TransactionsPage = () => {
  const { visibleTransactions } = useDerivedFinancials();
  const activeRole = useRoleStore((s) => s.activeRole);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const handleAdd = useCallback(() => {
    setEditingTx(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((tx: Transaction) => {
    setEditingTx(tx);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingTx(null);
  }, []);

  return (
    <div className="space-y-0">
      {/* Header with add button */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {visibleTransactions.length} transaction{visibleTransactions.length !== 1 ? 's' : ''} found
        </p>
        {activeRole === 'admin' && (
          <Button size="sm" onClick={handleAdd}>
            <Plus size={16} />
            Add Transaction
          </Button>
        )}
      </div>

      {/* Filter toolbar */}
      <FilterToolbar />

      {/* Transaction table */}
      <Card className="mt-4 p-0 overflow-hidden">
        <TransactionList transactions={visibleTransactions} onEdit={handleEdit} />
      </Card>

      {/* Add/Edit modal (admin only) */}
      {activeRole === 'admin' && (
        <TransactionFormModal
          open={modalOpen}
          onClose={handleCloseModal}
          editingTransaction={editingTx}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
