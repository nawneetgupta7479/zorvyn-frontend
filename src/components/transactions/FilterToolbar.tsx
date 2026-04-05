import { Search, X } from 'lucide-react';
import { useFilterStore } from '../../store/filterStore';
import { ALL_CATEGORIES } from '../../constants/categoryConfig';
import TextInput from '../ui/TextInput';
import SelectInput from '../ui/SelectInput';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';
import type { TransactionKind, SpendingCategory } from '../../types/finance';

/** Sticky filter toolbar for the transactions page */
const FilterToolbar = () => {
  const {
    keyword, setKeyword,
    kindFilter, setKindFilter,
    categoryFilter, setCategoryFilter,
    fromDate, setFromDate,
    toDate, setToDate,
    sortField, setSortField,
    sortDirection, setSortDirection,
    clearAllFilters,
  } = useFilterStore();

  const kindOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...ALL_CATEGORIES.map((c) => ({ value: c, label: c })),
  ];

  const sortOptions = [
    { value: 'date', label: 'Sort by Date' },
    { value: 'amount', label: 'Sort by Amount' },
  ];

  const hasActiveFilters =
    keyword !== '' ||
    kindFilter !== 'all' ||
    categoryFilter !== 'all' ||
    fromDate !== null ||
    toDate !== null;

  return (
    <div className="sticky top-16 z-20 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="flex flex-wrap items-end gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="input-base pl-9"
          />
        </div>

        {/* Kind filter — three toggle buttons */}
        <div className="inline-flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {kindOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setKindFilter(value as 'all' | TransactionKind)}
              className={cn(
                'px-3 py-2 text-xs font-medium transition-colors',
                kindFilter === value
                  ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Category */}
        <SelectInput
          id="filter-category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as 'all' | SpendingCategory)}
          options={categoryOptions}
          className="w-40 py-2 text-xs"
        />

        {/* Date range */}
        <TextInput
          id="filter-from"
          type="date"
          value={fromDate ?? ''}
          onChange={(e) => setFromDate(e.target.value || null)}
          className="w-36 py-2 text-xs"
          placeholder="From"
        />
        <TextInput
          id="filter-to"
          type="date"
          value={toDate ?? ''}
          onChange={(e) => setToDate(e.target.value || null)}
          className="w-36 py-2 text-xs"
          placeholder="To"
        />

        {/* Sort */}
        <SelectInput
          id="filter-sort"
          value={sortField}
          onChange={(e) => setSortField(e.target.value as 'date' | 'amount')}
          options={sortOptions}
          className="w-36 py-2 text-xs"
        />
        <button
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          className="btn-secondary py-2 px-3 text-xs"
          aria-label="Toggle sort direction"
        >
          {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>

        {/* Clear */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs gap-1">
            <X size={14} />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterToolbar;
