import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button.jsx';

export default function CharacterCustomization() {
  return (
    <div className="card p-6">
      <h2 className="font-display text-ink text-base mb-2">Customize</h2>
      <p className="text-sm text-ink-muted mb-4">
        Cosmetics and themes from the shop apply here once equipped.
      </p>
      <Link to="/app/rewards">
        <Button variant="ghost" className="w-full">Browse rewards</Button>
      </Link>
    </div>
  );
}
