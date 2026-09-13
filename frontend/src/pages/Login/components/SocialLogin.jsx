import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import { useToast } from '../../../components/common/Toast.jsx';
import { getErrorMessage } from '../../../utils/errorHandler.js';
import Button from '../../../components/common/Button.jsx';

// No real OAuth provider is wired up yet — this signs in with a demo
// character so reviewers/teammates can explore without creating an account,
// rather than shipping a button that does nothing.
//
// FIX: this used to call login({ email: 'guest@liferpg.app', password:
// 'guestguest' }) - credentials that only ever existed in the old mock
// database. Against the real backend that account never existed, so this
// 401'd every single time anyone clicked it. Now calls a dedicated
// guestLogin() (backed by a real find-or-create endpoint), and shows a
// toast on failure instead of failing silently.
export default function SocialLogin() {
  const { guestLogin } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function handleGuest() {
    setLoading(true);
    try {
      await guestLogin();
      navigate('/app', { replace: true });
    } catch (err) {
      toast(getErrorMessage(err), 'error');
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