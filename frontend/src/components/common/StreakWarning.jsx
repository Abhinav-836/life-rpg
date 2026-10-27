import { Link } from 'react-router-dom';
import { useStreak } from '../../hooks/useStreak.js';
import { useSettings } from '../../hooks/useSettings.js';

// "Your streak is at risk" banner: a streak is running but nothing has been
// completed today. Hidden if the player turned the warning off in Settings.
export default function StreakWarning({ showLink = true }) {
  const { data: streak } = useStreak();
  const { data: settings } = useSettings();

  if (!streak || settings?.notifications?.streakWarning === false) return null;
  if (!(streak.current > 0 && !streak.activeToday)) return null;

  return (
    <div role="status" className="rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-4 py-3 mb-6 flex flex-wrap items-center justify-between gap-2">
      <span>Your {streak.current}-day streak is at risk — complete a quest today to keep it alive.</span>
      {showLink && (
        <Link to="/app/quests" className="underline underline-offset-2 hover:text-ink">Go to quests</Link>
      )}
    </div>
  );
}