import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button.jsx';
import ConfirmDialog from '../../../components/common/ConfirmDialog.jsx';

export default function DangerZone() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="card p-6 border-danger/30">
      <h2 className="font-display text-danger text-base mb-1">Danger zone</h2>
      <p className="text-sm text-ink-muted mb-4">Log out of this device, or end your session entirely.</p>
      <Button variant="danger" onClick={() => setConfirming(true)}>Log out</Button>
      <ConfirmDialog
        open={confirming}
        title="Log out?"
        description="You'll need to sign back in to continue your quests."
        confirmLabel="Log out"
        danger
        onConfirm={handleLogout}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
