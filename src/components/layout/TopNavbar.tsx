import { useState, useEffect, useCallback } from 'react';
import { Menu, Sun, Moon, Download, Shield, Eye } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useRoleStore } from '../../store/roleStore';
import { useTransactionStore } from '../../store/transactionStore';
import { useDerivedFinancials } from '../../hooks/useDerivedFinancials';
import { downloadAsCSV } from '../../utils/fileExport';
import Button from '../ui/Button';

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
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('fin-theme');
    // Default to dark mode for the Midnight Aurora theme
    const prefersDark = stored ? stored === 'dark' : true;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
    document.body.classList.toggle('dark', prefersDark);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      document.body.classList.toggle('dark', next);
      localStorage.setItem('fin-theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  const handleExport = useCallback(() => {
    const toExport = location.pathname === '/transactions' ? visibleTransactions : rawTransactions;
    downloadAsCSV(toExport, `zorvyn-export-${new Date().toISOString().slice(0, 10)}.csv`);
  }, [visibleTransactions, rawTransactions, location.pathname]);

  const handleRoleToggle = useCallback(() => {
    switchRole(activeRole === 'admin' ? 'viewer' : 'admin');
  }, [activeRole, switchRole]);

  return (
    <header className="accent-line-bottom sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-6 bg-white/80 dark:bg-[#0d1117]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {pageTitle}
          </h1>
          {/* Accent dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 hidden sm:block animate-pulse" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Role toggle — styled pill button */}
        <button
          onClick={handleRoleToggle}
          title={`Switch to ${activeRole === 'admin' ? 'Viewer' : 'Admin'} mode`}
          className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 border ${
            activeRole === 'admin'
              ? 'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/50 dark:border-violet-700/50 dark:text-violet-300 dark:hover:bg-violet-900/40'
              : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:border-amber-700/40 dark:text-amber-400 dark:hover:bg-amber-900/30'
          }`}
        >
          {activeRole === 'admin' ? <Shield size={12} /> : <Eye size={12} />}
          {activeRole === 'admin' ? 'Admin' : 'Viewer'}
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/70 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Export button */}
        <Button variant="ghost" size="sm" onClick={handleExport}
          className="gap-1.5 text-xs font-medium rounded-xl dark:hover:bg-slate-800/70"
        >
          <Download size={15} />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
    </header>
  );
};

export default TopNavbar;
