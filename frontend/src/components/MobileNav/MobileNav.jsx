import { NavLink } from 'react-router-dom';

const ITEMS = [
  { to: '/app', label: 'Home', icon: '⌂', end: true },
  { to: '/app/quests', label: 'Quests', icon: '⚔' },
  { to: '/app/character', label: 'Hero', icon: '☉' },
  { to: '/app/rewards', label: 'Shop', icon: '⛃' },
  { to: '/app/profile', label: 'You', icon: '⚙' },
];

export default function MobileNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/40 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)] shadow-2xl"
    >
      <ul className="flex justify-between px-2">
        {ITEMS.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${
                  isActive ? 'text-purple-bright font-semibold' : 'text-gray-300'
                }`
              }
            >
              <span className="text-lg" aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
