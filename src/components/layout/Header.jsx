import { Menu, UtensilsCrossed } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/dashboard':       'Dashboard',
  '/input':           'Log Entry',
  '/reports':         'Reports',
  '/recommendations': 'Recommendations',
  '/alerts':          'Alerts & Notifications',
  '/sustainability':  'Sustainability Impact',
  '/about':           'About',
};

/**
 * Header — shown on all screen sizes.
 * On desktop the sidebar provides branding, so this is minimal.
 * On mobile it shows the hamburger + logo + admin avatar.
 */
export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? 'FoodWise';

  return (
    <header className="flex items-center h-14 px-4 border-b border-border bg-paper flex-shrink-0">
      {/* Hamburger – mobile only */}
      <button
        className="lg:hidden mr-3 p-1.5 rounded-lg hover:bg-cream-dark text-ink focus-ring"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile logo */}
      <div className="flex items-center gap-2 lg:hidden mr-auto">
        <div className="w-6 h-6 rounded bg-clay flex items-center justify-center">
          <UtensilsCrossed className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-serif font-semibold text-sm text-ink">FoodWise</span>
      </div>

      {/* Page title – desktop only */}
      <h1 className="hidden lg:block font-serif text-xl font-semibold text-ink mr-auto">{title}</h1>

      {/* Admin avatar */}
      <div className="flex items-center gap-2 ml-auto">
        <div className="flex items-center gap-2 bg-cream-dark rounded-xl px-3 py-1.5">
          <div className="w-6 h-6 rounded-full bg-clay flex items-center justify-center text-white text-xs font-semibold">
            A
          </div>
          <span className="text-sm font-medium text-ink hidden sm:inline">Admin</span>
        </div>
      </div>
    </header>
  );
}
