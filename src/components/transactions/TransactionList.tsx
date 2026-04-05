import { useState, useCallback } from 'react';
import { Pencil, Trash2, ArrowUpDown, SearchX } from 'lucide-react';
import { formatINR, formatDisplayDate } from '../../utils/currency';
import { categoryConfig } from '../../constants/categoryConfig';
import { cn } from '../../utils/cn';
import { useRoleStore } from '../../store/roleStore';
import { useTransactionStore } from '../../store/transactionStore';
import { useFilterStore } from '../../store/filterStore';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import type { Transaction, SpendingCategory } from '../../types/finance';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
}

/** Full transaction table with sortable headers, role-based actions, and empty state */
const TransactionList = ({ transactions, onEdit }: TransactionListProps) => {
  const activeRole = useRoleStore((s) => s.activeRole);
  const removeEntry = useTransactionStore((s) => s.removeEntry);
  const { sortField, sortDirection, setSortField, setSortDirection } = useFilterStore();
  const clearAllFilters = useFilterStore((s) => s.clearAllFilters);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSort = useCallback(
    (field: 'date' | 'amount') => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('desc');
      }
    },
    [sortField, sortDirection, setSortField, setSortDirection]
  );

  const handleDelete = useCallback(
    (id: string) => {
      removeEntry(id);
      setConfirmDeleteId(null);
    },
    [removeEntry]
  );

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <SearchX size={28} className="text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
          No transactions match your filters
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Try adjusting your search criteria or clear all filters
        </p>
        <Button variant="secondary" size="sm" onClick={clearAllFilters}>
          Clear Filters
        </Button>
      </div>
    );
  }

  const SortIcon = ({ field }: { field: 'date' | 'amount' }) => (
    <ArrowUpDown
      size={14}
      className={cn(
        'inline ml-1 transition-colors',
        sortField === field ? 'text-indigo-500' : 'text-gray-400'
      )}
    />
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th
              className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              onClick={() => handleSort('date')}
            >
              Date <SortIcon field="date" />
            </th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Description
            </th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Category
            </th>
            <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th
              className="py-3 px-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              onClick={() => handleSort('amount')}
            >
              Amount <SortIcon field="amount" />
            </th>
            {activeRole === 'admin' && (
              <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
          {transactions.map((tx) => {
            const config = categoryConfig[tx.category as SpendingCategory];
            const isDeleting = confirmDeleteId === tx.id;

            return (
              <tr
                key={tx.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-3.5 px-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                  {formatDisplayDate(tx.date)}
                </td>
                <td
                  className="py-3.5 px-4 max-w-[200px] truncate text-gray-900 dark:text-gray-100 font-medium"
                  title={tx.description}
                >
                  {tx.description}
                </td>
                <td className="py-3.5 px-4">
                  <Badge color={config?.color} textColor={config?.textColor}>
                    {tx.category}
                  </Badge>
                </td>
                <td className="py-3.5 px-4">
                  <Badge
                    color={tx.kind === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-rose-100 dark:bg-rose-900/30'}
                    textColor={tx.kind === 'income' ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}
                  >
                    {tx.kind === 'income' ? 'Income' : 'Expense'}
                  </Badge>
                </td>
                <td
                  className={cn(
                    'py-3.5 px-4 text-right font-semibold whitespace-nowrap',
                    tx.kind === 'income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  )}
                >
                  {tx.kind === 'income' ? '+' : '-'}{formatINR(tx.amount)}
                </td>
                {activeRole === 'admin' && (
                  <td className="py-3.5 px-4 text-right">
                    {isDeleting ? (
                      <div className="inline-flex items-center gap-1.5">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Delete?</span>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onEdit(tx)}
                          className="rounded-lg p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                          aria-label={`Edit ${tx.description}`}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(tx.id)}
                          className="rounded-lg p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                          aria-label={`Delete ${tx.description}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
