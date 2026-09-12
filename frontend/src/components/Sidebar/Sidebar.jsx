import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useCharacter } from '../../hooks/useCharacter.js';
import sidebarBg from '../../assets/images/sidebar-bg.jpg';

const NAV_ITEMS = [
  { to: '/app', label: 'Dashboard', icon: '⌂', end: true },
  { to: '/app/quests', label: 'Quests', icon: '⚔' },
  { to: '/app/character', label: 'Character', icon: '☉' },
  { to: '/app/stats', label: 'Stats', icon: '◈' },
  { to: '/app/streak', label: 'Streak', icon: '❖' },
  { to: '/app/rewards', label: 'Rewards', icon: '⛃' },
  { to: '/app/inventory', label: 'Inventory', icon: '⛁' },
  { to: '/app/badges', label: 'Badges', icon: '☖' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const { data: character } = useCharacter();

  return (
    <aside 
      className="hidden md:flex md:w-64 shrink-0 flex-col border-r border-white/10 h-screen fixed top-0 left-0 z-30 overflow-hidden"
      style={{
        backgroundImage: `url(${sidebarBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'left top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Subtle translucent tint to keep nav items legible while letting artwork shine */}
      <div className="absolute inset-0 bg-void/25 backdrop-blur-[1px] pointer-events-none" />

      <div className="px-5 py-6 shrink-0 relative z-10">
        <p className="font-display text-lg text-white font-bold tracking-wide drop-shadow-md">Life RPG</p>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto sidebar-scroll pr-2 relative z-10" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive 
                  ? 'bg-white/20 text-white font-semibold border border-white/30 backdrop-blur-md shadow-md' 
                  : 'text-gray-200 hover:text-white hover:bg-white/10 backdrop-blur-[2px]'
              }`
            }
          >
            <span aria-hidden="true" className="w-4 text-center">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5 pt-3 border-t border-white/10 shrink-0 mt-auto bg-black/25 backdrop-blur-sm relative z-10">
        {character && (
          <div className="px-3 py-2 mb-2 text-xs text-gray-300 drop-shadow-sm">
            Lv.{character.level} · {character.gold}g
          </div>
        )}
        {/*
          FIX: this used to render `{user?.name || 'Profile'}` — so instead of
          a fixed nav label like every other item above, it showed whatever
          name the logged-in test account used (e.g. "Guy"). Every other item
          in this sidebar is a category label, not dynamic data, so this one
          should be too. The user's actual name is already shown in the
          TopBar / Profile page — no need to duplicate it here.
        */}
        <NavLink to="/app/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
          <span aria-hidden="true">⚙</span> Profile
        </NavLink>
        <button
          type="button"
          onClick={logout}
          className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-danger hover:bg-danger/10 transition-colors"
        >
          <span aria-hidden="true">⏻</span> Log out
        </button>
      </div>
    </aside>
  );
}
