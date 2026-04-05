import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Wallet, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useRoleStore } from '../../store/roleStore';
import Badge from '../ui/Badge';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/insights', label: 'Insights', icon: Lightbulb },
];

interface AppSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

/** Fixed left sidebar with navigation links, app branding, and role badge */
const AppSidebar = ({ mobileOpen, onClose }: AppSidebarProps) => {
  const activeRole = useRoleStore((s) => s.activeRole);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out',
          // Mobile: full width sidebar as drawer
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'w-64 md:translate-x-0',
          // Tablet: collapsed icon-only
          'md:w-16 lg:w-64'
        )}
      >
        {/* Branding */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500">
              <Wallet size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100 md:hidden lg:block">
              FinanceIQ
            </span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  isActive ? 'sidebar-link-active' : 'sidebar-link',
                  'md:justify-center lg:justify-start'
                )
              }
            >
              <Icon size={20} />
              <span className="md:hidden lg:inline">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Role badge */}
        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
          <Badge
            color={activeRole === 'admin' ? 'bg-indigo-100 dark:bg-indigo-900/40' : 'bg-amber-100 dark:bg-amber-900/40'}
            textColor={activeRole === 'admin' ? 'text-indigo-700 dark:text-indigo-300' : 'text-amber-700 dark:text-amber-300'}
            className="w-full justify-center py-1.5 md:text-[0] lg:text-xs"
          >
            <span className="md:hidden lg:inline">{activeRole === 'admin' ? '🛡️ Admin' : '👁️ Viewer'}</span>
            <span className="hidden md:inline lg:hidden">{activeRole === 'admin' ? '🛡️' : '👁️'}</span>
          </Badge>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
