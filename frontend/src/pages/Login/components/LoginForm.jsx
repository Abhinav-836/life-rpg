import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import { getErrorMessage } from '../../../utils/errorHandler.js';
import Input from '../../../components/common/Input.jsx';
import Button from '../../../components/common/Button.jsx';
import ErrorMessage from '../../../components/common/ErrorMessage.jsx';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  function validate() {
    const errors = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.';
    if (!form.password) errors.password = 'Enter your password.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/app', { replace: true });
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
        label="Email"
        type="email"
        autoComplete="email"
        value={form.email}
        error={fieldErrors.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        placeholder="you@example.com"
      />
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          value={form.password}
          error={fieldErrors.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          placeholder="••••••••"
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

      <div className="flex justify-end -mt-1">
        <button type="button" onClick={() => setForgotOpen(true)} className="text-xs text-purple hover:text-ink">
          Forgot password?
        </button>
      </div>

      <Button type="submit" className="w-full" loading={submitting}>
        Enter the realm
      </Button>

      {forgotOpen && (
        <p role="status" className="text-xs text-ink-muted text-center pt-1">
          If an account exists for that email, a reset link is on its way.
        </p>
      )}
    </form>
  );
}
