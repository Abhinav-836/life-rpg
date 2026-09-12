import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import PublicRoute from './PublicRoute.jsx';
import Loader from '../components/common/Loader.jsx';

const Landing = lazy(() => import('../pages/Landing/Landing.jsx'));
const Login = lazy(() => import('../pages/Login/Login.jsx'));
const Signup = lazy(() => import('../pages/Signup/Signup.jsx'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard.jsx'));
const Quests = lazy(() => import('../pages/Quests/Quests.jsx'));
const Character = lazy(() => import('../pages/Character/Character.jsx'));
const Stats = lazy(() => import('../pages/Stats/Stats.jsx'));
const Streak = lazy(() => import('../pages/Streak/Streak.jsx'));
const Rewards = lazy(() => import('../pages/Rewards/Rewards.jsx'));
const Inventory = lazy(() => import('../pages/Inventory/Inventory.jsx'));
const Badges = lazy(() => import('../pages/Badges/Badges.jsx'));
const Profile = lazy(() => import('../pages/Profile/Profile.jsx'));
const Settings = lazy(() => import('../pages/Settings/Settings.jsx'));

function PageFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Loader label="Loading…" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="quests" element={<Quests />} />
            <Route path="character" element={<Character />} />
            <Route path="stats" element={<Stats />} />
            <Route path="streak" element={<Streak />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="badges" element={<Badges />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="font-display text-4xl text-ink mb-2">404</p>
      <p className="text-ink-muted mb-6">This path doesn't lead anywhere on the map.</p>
      <a href="/" className="text-purple underline underline-offset-4">Return to camp</a>
    </div>
  );
}
