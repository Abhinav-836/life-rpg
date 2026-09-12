import { Link } from 'react-router-dom';

export default function SignupFooter() {
  return (
    <p className="text-center text-sm text-gray-200 mt-6 drop-shadow-md">
      Already have a character?{' '}
      <Link to="/login" className="text-purple-bright hover:text-white font-semibold underline underline-offset-4">Log in</Link>
    </p>
  );
}
