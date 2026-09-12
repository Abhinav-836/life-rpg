import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import LevelUpAnimation from './LevelUpAnimation.jsx';

export default function LevelUpModal({ open, level, onClose }) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="relative text-center py-4">
        <LevelUpAnimation />
        <div className="relative">
          <p className="text-xs uppercase tracking-wide text-gold mb-2">Level Up</p>
          <p className="font-display text-4xl text-ink mb-1">Level {level}</p>
          <p className="text-sm text-ink-muted mb-6">Your legend grows. New strength awaits.</p>
          <Button variant="gold" onClick={onClose} className="w-full">Continue</Button>
        </div>
      </div>
    </Modal>
  );
}
