import { useState, useCallback, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import TopNavbar from './TopNavbar';

interface PageShellProps {
  children: ReactNode;
}

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/insights': 'Insights',
};

/** App layout shell with sidebar + top navbar wrapping page content */
const PageShell = ({ children }: PageShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? 'Zorvyn Finance';

  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#050914] transition-colors duration-300 aurora-grid">
      <AppSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main content area — offset by sidebar width */}
      <div className="md:ml-16 lg:ml-64 flex flex-col min-h-screen transition-[margin] duration-300">
        <TopNavbar pageTitle={pageTitle} onMenuToggle={toggleSidebar} />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
        <footer className="px-4 lg:px-6 py-3 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200 dark:border-slate-800/60">
          © 2026 Zorvyn Finance · Built for the Zorvyn Frontend Task
        </footer>
      </div>
    </div>
  );
};

export default PageShell;
