import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, X, Zap } from 'lucide-react';
import { useRef } from 'react';
import { cn } from '../../utils/cn';
import { useRoleStore } from '../../store/roleStore';
import { useSlideInLeft } from '../../hooks/useGsapAnimations';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/insights', label: 'Insights', icon: Lightbulb },
];

interface AppSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

/** Fixed left sidebar with navigation links, aurora branding, and role badge at top */
const AppSidebar = ({ mobileOpen, onClose }: AppSidebarProps) => {
  const activeRole = useRoleStore((s) => s.activeRole);
  const navRef = useRef<HTMLElement>(null);
  useSlideInLeft(navRef, 'a', 0.15);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen flex flex-col transition-transform duration-300 ease-in-out',
          'border-r border-slate-200 dark:border-slate-800/80',
          'bg-white dark:bg-[#0d1117]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'w-64 md:translate-x-0',
          'md:w-16 lg:w-64'
        )}
        style={{
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.06) 0%, transparent 70%)',
        }}
      >
        {/* Branding + Role badge in same header row */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Logo mark */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
              <Zap size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col md:hidden lg:flex">
              <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                Zorvyn
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 -mt-0.5">
                Finance
              </span>
            </div>
          </div>

          {/* Role pill — visible on lg only */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                activeRole === 'admin'
                  ? 'bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300'
                  : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
              )}
            >
              <span>{activeRole === 'admin' ? '🛡️' : '👁️'}</span>
              <span>{activeRole === 'admin' ? 'Admin' : 'Viewer'}</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="md:hidden rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav ref={navRef} className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  isActive ? 'sidebar-link-active' : 'sidebar-link',
                  'md:justify-center lg:justify-start group'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={19}
                    className={cn(
                      'shrink-0 transition-colors',
                      isActive ? 'text-violet-600 dark:text-violet-400' : ''
                    )}
                  />
                  <span className="md:hidden lg:inline">{label}</span>
                  {isActive && (
                    <span className="ml-auto md:hidden lg:block w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom role indicator (icon-only on tablet) */}
        <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800/80 md:flex lg:hidden items-center justify-center hidden">
          <span title={activeRole === 'admin' ? 'Admin Mode' : 'Viewer Mode'} className="text-lg">
            {activeRole === 'admin' ? '🛡️' : '👁️'}
          </span>
        </div>

        {/* Footer: version tag on lg */}
        <div className="hidden lg:block px-4 pb-4 text-[10px] text-slate-400 dark:text-slate-600">
          v1.0.0 · Zorvyn Finance
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
