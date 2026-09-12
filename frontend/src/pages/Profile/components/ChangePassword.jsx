import { useState } from 'react';
import { useChangePassword } from '../../../hooks/useProfile.js';
import { useToast } from '../../../components/common/Toast.jsx';
import { getErrorMessage } from '../../../utils/errorHandler.js';
import Input from '../../../components/common/Input.jsx';
import Button from '../../../components/common/Button.jsx';
import ErrorMessage from '../../../components/common/ErrorMessage.jsx';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const changePassword = useChangePassword();
  const toast = useToast();
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await changePassword.mutateAsync(form);
      toast('Password updated.', 'success');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <h2 className="font-display text-ink text-base mb-1">Change password</h2>
      {error && <ErrorMessage message={error} />}
      <Input
        label="Current password"
        type="password"
        autoComplete="current-password"
        value={form.currentPassword}
        onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))}
      />
      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        value={form.newPassword}
        onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
      />
      <div className="flex justify-end">
        <Button type="submit" variant="ghost" loading={changePassword.isPending}>Update password</Button>
      </div>
    </form>
  );
}
