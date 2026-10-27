import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUpdateProfile } from '../../../hooks/useProfile.js';
import { useToast } from '../../../components/common/Toast.jsx';
import { getErrorMessage } from '../../../utils/errorHandler.js';
import Input from '../../../components/common/Input.jsx';
import Button from '../../../components/common/Button.jsx';
import ErrorMessage from '../../../components/common/ErrorMessage.jsx';

export default function ProfileForm({ profile }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const updateProfile = useUpdateProfile();
  const toast = useToast();
  const [error, setError] = useState('');
  const isGuest = Boolean(profile?.isGuest);

  useEffect(() => {
    if (profile) setForm({ name: profile.name, email: isGuest ? '' : profile.email });
  }, [profile, isGuest]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    // Only send what changed, so renaming a demo character doesn't also
    // try to change its (locked) email.
    const changes = {};
    if (form.name !== profile?.name) changes.name = form.name;
    if (!isGuest && form.email !== profile?.email) changes.email = form.email;
    if (Object.keys(changes).length === 0) return;

    try {
      await updateProfile.mutateAsync(changes);
      toast('Profile updated.', 'success');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <h2 className="font-display text-ink text-base mb-1">Account details</h2>
      {isGuest && (
        <p role="status" className="rounded-lg border border-gold/30 bg-gold/10 text-sm text-ink px-4 py-3">
          You're playing on a demo account — it's deleted after 7 days.{' '}
          <Link to="/signup" className="underline underline-offset-2">Create an account</Link> to keep your progress.
        </p>
      )}
      {error && <ErrorMessage message={error} />}
      <Input
        label="Character name"
        value={form.name}
        maxLength={50}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
      />
      {!isGuest && (
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      )}
      <div className="flex justify-end">
        <Button type="submit" loading={updateProfile.isPending}>Save changes</Button>
      </div>
    </form>
  );
}