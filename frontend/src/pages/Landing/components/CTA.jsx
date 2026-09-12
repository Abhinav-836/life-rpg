import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button.jsx';

export default function CTA() {
  return (
    <section className="px-6 py-20 border-t border-white/10 text-center">
      <h2 className="font-display text-2xl sm:text-3xl text-white mb-3 drop-shadow-md">Your first quest is one click away</h2>
      <p className="text-gray-200 mb-8 drop-shadow-sm">Free to start. No credit card, no waiting.</p>
      <Link to="/signup">
        <Button size="lg" className="shadow-xl shadow-purple/30">Create your character</Button>
      </Link>
    </section>
  );
}
