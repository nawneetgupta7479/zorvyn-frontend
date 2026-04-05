import { useState, useEffect, useCallback } from 'react';
import { Menu, Sun, Moon, Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useRoleStore } from '../../store/roleStore';
import { useTransactionStore } from '../../store/transactionStore';
import { useDerivedFinancials } from '../../hooks/useDerivedFinancials';
import { downloadAsCSV } from '../../utils/fileExport';
import SelectInput from '../ui/SelectInput';
import Button from '../ui/Button';
import type { Role } from '../../types/finance';

interface TopNavbarProps {
  pageTitle: string;
  onMenuToggle: () => void;
}

/** Top navigation bar with role switcher, dark mode toggle, and export */
const TopNavbar = ({ pageTitle, onMenuToggle }: TopNavbarProps) => {
  const { activeRole, switchRole } = useRoleStore();
  const { visibleTransactions } = useDerivedFinancials();
  const rawTransactions = useTransactionStore((s) => s.transactions);
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('fin-theme');
    const prefersDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('fin-theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  const handleExport = useCallback(() => {
    const toExport = location.pathname === '/transactions' ? visibleTransactions : rawTransactions;
    downloadAsCSV(toExport, `financeiq-export-${new Date().toISOString().slice(0, 10)}.csv`);
  }, [visibleTransactions, rawTransactions, location.pathname]);

  const handleRoleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      switchRole(e.target.value as Role);
    },
    [switchRole]
  );

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:block">
          <SelectInput
            id="role-switcher"
            value={activeRole}
            onChange={handleRoleChange}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'viewer', label: 'Viewer' },
            ]}
            className="w-28 py-1.5 text-xs"
          />
        </div>

        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Button variant="ghost" size="sm" onClick={handleExport}>
          <Download size={16} />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
    </header>
  );
};

export default TopNavbar;
