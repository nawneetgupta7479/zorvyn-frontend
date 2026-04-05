import Card from '../ui/Card';
import { formatINR } from '../../utils/currency';
import { categoryConfig } from '../../constants/categoryConfig';
import type { CategoryTotal, SpendingCategory } from '../../types/finance';

interface CategoryBreakdownTableProps {
  categoryTotals: CategoryTotal[];
}

/** Expense category breakdown table with inline progress bars and percentages */
const CategoryBreakdownTable = ({ categoryTotals }: CategoryBreakdownTableProps) => {
  const grandTotal = categoryTotals.reduce((sum, c) => sum + c.total, 0);

  if (categoryTotals.length === 0) {
    return (
      <Card className="animate-slide-up">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No expense data to display
        </p>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Category Breakdown
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount Spent
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                % of Total
              </th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tx Count
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                Bar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
            {categoryTotals.map(({ category, total, count }) => {
              const config = categoryConfig[category as SpendingCategory];
              const pct = grandTotal > 0 ? (total / grandTotal) * 100 : 0;

              return (
                <tr key={category} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: config?.hex ?? '#6b7280' }}
                      />
                      {category}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300 font-medium">
                    {formatINR(total)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-400">
                    {pct.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-400">
                    {count}
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
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
  );
};

export default CategoryBreakdownTable;
