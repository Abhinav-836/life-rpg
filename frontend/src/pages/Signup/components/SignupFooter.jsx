import { Link } from 'react-router-dom';

export default function SignupFooter() {
  return (
    <p className="text-center text-sm text-gray-200 mt-6 drop-shadow-md">
      Already have a character?{' '}
      <Link to="/login" className="text-purple-bright hover:text-white font-semibold underline underline-offset-4">Log in</Link>
      <span className="block mt-3 text-xs text-gray-300">
        By creating an account you agree to the{' '}
        <Link to="/terms" className="underline underline-offset-2 hover:text-white">Terms</Link> and{' '}
        <Link to="/privacy" className="underline underline-offset-2 hover:text-white">Privacy policy</Link>.
      </span>
    </p>
  );
}
