import { useState, useCallback } from 'react';
import { Plus, Eye } from 'lucide-react';
import { useDerivedFinancials } from '../hooks/useDerivedFinancials';
import { useRoleStore } from '../store/roleStore';
import TransactionList from '../components/transactions/TransactionList';
import FilterToolbar from '../components/transactions/FilterToolbar';
import TransactionFormModal from '../components/transactions/TransactionFormModal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import type { Transaction } from '../types/finance';

/** Transactions page with unified sticky header+filter bar, data table, and add/edit modal */
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
      {/*
        ─────────────────────────────────────────────────────────────────────
        UNIFIED STICKY BLOCK
        Wraps the viewer banner + count/add row + filter controls in ONE
        sticky container so there is NEVER a gap between the navbar and
        the filter bar while scrolling.
        ─────────────────────────────────────────────────────────────────────
      */}
      <div className="bg-[#f0f4ff]/95 dark:bg-[#050914]/98 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80">

        {/* Viewer-mode read-only banner */}
        {activeRole === 'viewer' && (
          <div className="flex items-center gap-3 px-4 lg:px-6 py-2 border-b border-amber-200/60 dark:border-amber-800/30 bg-amber-50/80 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-sm">
            <Eye size={15} className="shrink-0" />
            <span className="font-semibold">Viewer mode</span>
            <span className="text-amber-600 dark:text-amber-500 text-xs hidden sm:inline">
              — You can view transactions but cannot add, edit or delete.
            </span>
          </div>
        )}

        {/* Row 1: transaction count + Add button */}
        <div className="flex items-center justify-between px-4 lg:px-6 pt-2.5 pb-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{visibleTransactions.length}</span>
            {' '}transaction{visibleTransactions.length !== 1 ? 's' : ''} found
          </p>
          {activeRole === 'admin' && (
            <Button size="sm" onClick={handleAdd}>
              <Plus size={15} />
              Add Transaction
            </Button>
          )}
        </div>

        {/* Row 2: filter controls */}
        <div className="px-4 lg:px-6 pb-3">
          <FilterToolbar />
        </div>
      </div>

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
