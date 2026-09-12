import { Outlet, Link } from 'react-router-dom';
import loginBg from '../assets/images/login-bg.png';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-ink">
      {/* Background image plate - full screen, sharp and visible */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        {/* Subtle translucent tint so night fantasy art shines through */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <header className="px-6 sm:px-12 md:px-16 py-6 relative z-10">
        <Link to="/" className="font-display text-white text-xl font-bold tracking-wider hover:text-purple transition-colors drop-shadow-md">
          Life RPG
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-end px-6 sm:px-12 md:px-16 pb-16 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
