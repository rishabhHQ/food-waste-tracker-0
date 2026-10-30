import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, BarChart3,
  Lightbulb, Bell, Leaf, Info, UtensilsCrossed,
} from 'lucide-react';
import { useAlerts } from '../../hooks/useAlerts';

const navItems = [
  { to: '/dashboard',      label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/input',          label: 'Log Entry',        icon: ClipboardList   },
  { to: '/reports',        label: 'Reports',          icon: BarChart3       },
  { to: '/recommendations',label: 'Recommendations',  icon: Lightbulb       },
  { to: '/alerts',         label: 'Alerts',           icon: Bell, badge: true },
  { to: '/sustainability', label: 'Sustainability',   icon: Leaf            },
  { to: '/about',          label: 'About',            icon: Info            },
];

export default function Sidebar({ onNavigate }) {
  const { unreadCount } = useAlerts();

  return (
    <div className="flex flex-col h-full">
      {/* Logo / brand */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-clay flex items-center justify-center flex-shrink-0">
          <UtensilsCrossed className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-serif font-semibold text-ink text-base leading-tight">FoodWise</p>
          <p className="text-xs text-muted leading-tight">Wastage Tracker</p>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : 'nav-link-idle'}`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {badge && unreadCount > 0 && (
              <span className="text-xs font-semibold bg-tomato text-white rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer tagline */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-xs text-muted leading-relaxed">Track · Analyze · Predict · Reduce</p>
      </div>
    </div>
  );
}
