import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import { useProfile } from '../../../hooks/useProfile.js';
import { deleteAccount } from '../../../services/profile.api.js';
import { getErrorMessage } from '../../../utils/errorHandler.js';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';
import ErrorMessage from '../../../components/common/ErrorMessage.jsx';
import ConfirmDialog from '../../../components/common/ConfirmDialog.jsx';

export default function DangerZone() {
  const { logout } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const isGuest = Boolean(profile?.isGuest);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  async function handleDelete() {
    setDeleting(true);
    setError('');
    try {
      await deleteAccount(password);
      await logout();
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setConfirmingDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="card p-6 border-danger/30">
      <h2 className="font-display text-danger text-base mb-1">Danger zone</h2>
      <p className="text-sm text-ink-muted mb-4">Log out of this device, or delete your account and all of its progress.</p>
      <Button variant="danger" onClick={() => setConfirmingLogout(true)}>Log out</Button>

      <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
        <h3 className="text-sm font-medium text-ink">Delete account</h3>
        <p className="text-sm text-ink-muted">
          This permanently removes your character, quests, streak, items and badges. It can't be undone.
        </p>
        {error && <ErrorMessage message={error} />}
        {!isGuest && (
          <Input
            label="Confirm with your password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        <Button
          variant="danger"
          disabled={!isGuest && !password}
          onClick={() => setConfirmingDelete(true)}
        >
          Delete my account
        </Button>
      </div>

      <ConfirmDialog
        open={confirmingLogout}
        title="Log out?"
        description="You'll need to sign back in to continue your quests."
        confirmLabel="Log out"
        danger
        onConfirm={handleLogout}
        onCancel={() => setConfirmingLogout(false)}
      />
      <ConfirmDialog
        open={confirmingDelete}
        title="Delete your account?"
        description="Everything you've built — levels, gold, streaks, badges — will be gone for good."
        confirmLabel="Delete forever"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}