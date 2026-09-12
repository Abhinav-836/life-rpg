import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import { getErrorMessage } from '../../../utils/errorHandler.js';
import Input from '../../../components/common/Input.jsx';
import Button from '../../../components/common/Button.jsx';
import ErrorMessage from '../../../components/common/ErrorMessage.jsx';
import PasswordStrength from './PasswordStrength.jsx';

export default function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Give your character a name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.';
    if (!form.password || form.password.length < 8) errors.password = 'Use at least 8 characters.';
    if (form.confirmPassword !== form.password) errors.confirmPassword = "Passwords don't match.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await signup(form);
      navigate('/app', { replace: true });
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && <ErrorMessage message={formError} />}
      <Input
        label="Character name"
        autoComplete="name"
        value={form.name}
        error={fieldErrors.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        placeholder="Aria Voss"
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={form.email}
        error={fieldErrors.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        placeholder="you@example.com"
      />
      <div>
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={form.password}
            error={fieldErrors.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="At least 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-[34px] text-xs text-ink-faint hover:text-ink-muted"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <PasswordStrength password={form.password} />
      </div>
      <Input
        label="Confirm password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        value={form.confirmPassword}
        error={fieldErrors.confirmPassword}
        onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
        placeholder="Type it again"
      />
      <Button type="submit" className="w-full" loading={submitting}>
        Begin the adventure
      </Button>
    </form>
  );
}
