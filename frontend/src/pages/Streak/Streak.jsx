import { useStreak } from '../../hooks/useStreak.js';
import Loader from '../../components/common/Loader.jsx';
import StreakHeader from './components/StreakHeader.jsx';
import CurrentStreak from './components/CurrentStreak.jsx';
import LongestStreak from './components/LongestStreak.jsx';
import StreakCalendar from './components/StreakCalendar.jsx';
import ActivityHeatmap from './components/ActivityHeatmap.jsx';
import StreakRewards from './components/StreakRewards.jsx';
import StreakWarning from '../../components/common/StreakWarning.jsx';

export default function Streak() {
  const { data: streak, isLoading } = useStreak();

  if (isLoading) return <Loader label="Checking your streak…" size="lg" />;
  if (!streak) return null;

  const broken = streak.current === 0 && streak.longest > 0;

  return (
    <div>
      <StreakHeader />

      <StreakWarning />
      {broken && (
        <div role="status" className="rounded-lg border border-white/10 bg-white/5 text-ink-muted text-sm px-4 py-3 mb-6">
          Your streak reset. Complete a quest today to start a new one — your best is {streak.longest} days.
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