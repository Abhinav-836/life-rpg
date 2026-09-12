import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import Button from '../../../components/common/Button.jsx';

// No real OAuth provider is wired up yet — this signs in with a demo
// character so reviewers/teammates can explore without creating an account,
// rather than shipping a button that does nothing.
export default function SocialLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleGuest() {
    setLoading(true);
    try {
      await login({ email: 'guest@liferpg.app', password: 'guestguest' });
      navigate('/app', { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 text-xs text-gray-300 drop-shadow-sm">
        <span className="h-px flex-1 bg-white/20" /> or <span className="h-px flex-1 bg-white/20" />
      </div>
      <Button 
        variant="ghost" 
        className="w-full mt-4 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/25 text-white shadow-md font-medium" 
        loading={loading} 
        onClick={handleGuest}
      >
        Continue as guest
      </Button>
    </div>
  );
}
