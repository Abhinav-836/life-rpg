import ProgressBar from '../../../components/common/ProgressBar.jsx';
import { formatXP } from '../../../utils/formatXP.js';

export default function XPBar({ xpIntoLevel, xpForNext, totalXP }) {
  return (
    <div>
      <ProgressBar value={xpIntoLevel} max={xpForNext} color="#8B5CF6" label="Progress to next level" />
      <p className="text-xs text-ink-faint mt-2">{formatXP(totalXP)} earned total</p>
    </div>
  );
}
