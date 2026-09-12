import Modal from '../../../components/common/Modal.jsx';
import BadgeProgress from './BadgeProgress.jsx';
import { formatDate } from '../../../utils/formatDate.js';

const RARITY_COLOR = { common: '#A7B0C5', rare: '#6366F1', epic: '#8B5CF6', legendary: '#F4C95D' };

export default function BadgeDetails({ badge, onClose }) {
  if (!badge) return null;
  const color = RARITY_COLOR[badge.rarity];
  return (
    <Modal open={!!badge} onClose={onClose} title={badge.name} size="sm">
      <div
        className="h-14 w-14 rounded-lg flex items-center justify-center text-2xl mb-4"
        style={{ backgroundColor: `${color}1A`, color }}
        aria-hidden="true"
      >
        ☖
      </div>
      <p className="text-sm text-ink-muted mb-2">{badge.description}</p>
      <p className="text-xs uppercase tracking-wide mb-3" style={{ color }}>{badge.rarity}</p>
      {badge.earned ? (
        <p className="text-xs text-ink-faint">Earned {formatDate(badge.earnedAt)}</p>
      ) : (
        badge.target && <BadgeProgress progress={badge.progress} target={badge.target} />
      )}
    </Modal>
  );
}
