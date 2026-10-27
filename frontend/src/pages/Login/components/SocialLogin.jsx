import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import { useToast } from '../../../components/common/Toast.jsx';
import { getErrorMessage } from '../../../utils/errorHandler.js';
import Button from '../../../components/common/Button.jsx';

// "Try the demo" signs the visitor into their own private demo account
// (with a few starter quests), so they can explore without signing up.
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
        Try the demo — no sign-up
      </Button>
    </div>
  );
}