import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import Navbar from '../components/Navbar/Navbar.jsx';
import MobileNav from '../components/MobileNav/MobileNav.jsx';
import OfflineBanner from '../components/common/OfflineBanner.jsx';
import appBg from '../assets/images/app-bg.jpg';
import rewardsBg from '../assets/images/rewards-bg.jpg';

const TREASURE_PAGES = ['/app/rewards', '/app/inventory', '/app/badges'];

export default function MainLayout() {
  const location = useLocation();
  const isTreasurePage = TREASURE_PAGES.some((path) => location.pathname.startsWith(path));

  return (
    <div className="relative min-h-screen text-ink">
      {/* Default App background (balcony overlooking moonlit valley) */}
      <div 
        className={`fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-500 ease-in-out ${
          isTreasurePage ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundImage: `url(${appBg})` }}
      >
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Rewards, Inventory, and Badges treasure vault background */}
      <div 
        className={`fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-500 ease-in-out ${
          isTreasurePage ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url(${rewardsBg})` }}
      >
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col md:pl-64">
          <OfflineBanner />
          <Navbar />
          <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 pb-24 md:pb-12 max-w-6xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
        <MobileNav />
      </div>
    </div>
  );
}
