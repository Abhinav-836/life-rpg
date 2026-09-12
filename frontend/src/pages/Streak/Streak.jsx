import { useStreak } from '../../hooks/useStreak.js';
import Loader from '../../components/common/Loader.jsx';
import StreakHeader from './components/StreakHeader.jsx';
import CurrentStreak from './components/CurrentStreak.jsx';
import LongestStreak from './components/LongestStreak.jsx';
import StreakCalendar from './components/StreakCalendar.jsx';
import ActivityHeatmap from './components/ActivityHeatmap.jsx';
import StreakRewards from './components/StreakRewards.jsx';

function isMissedYesterday(lastActiveDate) {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  return lastActiveDate !== today && lastActiveDate !== yesterday;
}

export default function Streak() {
  const { data: streak, isLoading } = useStreak();

  if (isLoading) return <Loader label="Checking your streak…" size="lg" />;
  if (!streak) return null;

  const missed = isMissedYesterday(streak.lastActiveDate);

  return (
    <div>
      <StreakHeader />

      {missed && (
        <div role="status" className="rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-4 py-3 mb-6">
          Your streak is at risk — complete a quest today to keep it alive.
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <CurrentStreak current={streak.current} />
        </div>
        <LongestStreak longest={streak.longest} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <StreakCalendar history={streak.history} />
        <div className="space-y-6">
          <ActivityHeatmap history={streak.history} />
          <StreakRewards current={streak.current} />
        </div>
      </div>
    </div>
  );
}
