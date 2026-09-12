import { Link } from 'react-router-dom';

export default function AccountSettings() {
  return (
    <div className="card p-6">
      <h2 className="font-display text-ink text-base mb-1">Account</h2>
      <p className="text-sm text-ink-muted mb-4">Manage your name, email, and password from your profile.</p>
      <Link to="/app/profile" className="text-sm text-purple hover:text-ink">Go to profile →</Link>
    </div>
  );
}
