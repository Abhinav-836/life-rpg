import { Link } from 'react-router-dom';

export default function LoginFooter() {
  return (
    <p className="text-center text-sm text-gray-200 mt-6 drop-shadow-md">
      New to Life RPG?{' '}
      <Link to="/signup" className="text-purple-bright hover:text-white font-semibold underline underline-offset-4">Create your character</Link>
    </p>
  );
}
