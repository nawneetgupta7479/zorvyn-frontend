import { useState, useCallback, useRef } from 'react';
import { Pencil, Trash2, ArrowUpDown, SearchX } from 'lucide-react';
import { formatINR, formatDisplayDate } from '../../utils/currency';
import { categoryConfig } from '../../constants/categoryConfig';
import { cn } from '../../utils/cn';
import { useRoleStore } from '../../store/roleStore';
import { useTransactionStore } from '../../store/transactionStore';
import { useFilterStore } from '../../store/filterStore';
import { useStaggerEntrance } from '../../hooks/useGsapAnimations';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import type { Transaction, SpendingCategory } from '../../types/finance';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
}

/** Full transaction table with sortable headers, role-based actions, GSAP stagger rows, and aurora palette */
const TransactionList = ({ transactions, onEdit }: TransactionListProps) => {
  const activeRole = useRoleStore((s) => s.activeRole);
  const removeEntry = useTransactionStore((s) => s.removeEntry);
  const { sortField, sortDirection, setSortField, setSortDirection } = useFilterStore();
  const clearAllFilters = useFilterStore((s) => s.clearAllFilters);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  useStaggerEntrance(tbodyRef, 'tr', 0.05);

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
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center mb-4">
          <SearchX size={28} className="text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">
          No transactions match your filters
        </h3>
        <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
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
      size={13}
      className={cn(
        'inline ml-1 transition-colors',
        sortField === field ? 'text-violet-500' : 'text-slate-400'
      )}
    />
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700/60 bg-slate-50/80 dark:bg-slate-800/30">
            <th
              className="py-3 px-4 text-left text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              onClick={() => handleSort('date')}
            >
              Date <SortIcon field="date" />
            </th>
            <th className="py-3 px-4 text-left text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Description
            </th>
            <th className="py-3 px-4 text-left text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Category
            </th>
            <th className="py-3 px-4 text-left text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Type
            </th>
            <th
              className="py-3 px-4 text-right text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              onClick={() => handleSort('amount')}
            >
              Amount <SortIcon field="amount" />
            </th>
            {activeRole === 'admin' && (
              <th className="py-3 px-4 text-right text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody ref={tbodyRef} className="divide-y divide-slate-100 dark:divide-slate-700/30">
          {transactions.map((tx) => {
            const config = categoryConfig[tx.category as SpendingCategory];
            const isDeleting = confirmDeleteId === tx.id;

            return (
              <tr
                key={tx.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {formatDisplayDate(tx.date)}
                </td>
                <td
                  className="py-3.5 px-4 max-w-[200px] truncate text-slate-800 dark:text-slate-100 font-medium text-sm"
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
                    'py-3.5 px-4 text-right font-bold whitespace-nowrap text-sm',
                    tx.kind === 'income'
                      ? 'text-emerald-500 dark:text-emerald-400'
                      : 'text-rose-500 dark:text-rose-400'
                  )}
                >
                  {tx.kind === 'income' ? '+' : '−'}{formatINR(tx.amount)}
                </td>
                {activeRole === 'admin' && (
                  <td className="py-3.5 px-4 text-right">
                    {isDeleting ? (
                      <div className="inline-flex items-center gap-1.5">
                        <span className="text-xs text-slate-400 dark:text-slate-500">Delete?</span>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="text-xs font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onEdit(tx)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-colors"
                          aria-label={`Edit ${tx.description}`}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(tx.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          aria-label={`Delete ${tx.description}`}
                        >
                          <Trash2 size={14} />
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
