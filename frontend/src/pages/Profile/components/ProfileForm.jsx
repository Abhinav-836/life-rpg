import { useEffect, useState } from 'react';
import { useUpdateProfile } from '../../../hooks/useProfile.js';
import { useAuth } from '../../../hooks/useAuth.js';
import { useToast } from '../../../components/common/Toast.jsx';
import { getErrorMessage } from '../../../utils/errorHandler.js';
import Input from '../../../components/common/Input.jsx';
import Button from '../../../components/common/Button.jsx';
import ErrorMessage from '../../../components/common/ErrorMessage.jsx';

export default function ProfileForm({ profile }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const updateProfile = useUpdateProfile();
  const { user } = useAuth();
  const toast = useToast();
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) setForm({ name: profile.name, email: profile.email });
  }, [profile]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await updateProfile.mutateAsync(form);
      toast('Profile updated.', 'success');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <h2 className="font-display text-ink text-base mb-1">Account details</h2>
      {error && <ErrorMessage message={error} />}
      <Input label="Character name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
      <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
      <div className="flex justify-end">
        <Button type="submit" loading={updateProfile.isPending}>Save changes</Button>
      </div>
    </form>
  );
}
