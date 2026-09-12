import { Link } from 'react-router-dom';
import ProgressBar from '../../../components/common/ProgressBar.jsx';
import Skeleton from '../../../components/common/Skeleton.jsx';

export default function CharacterSummary({ character, isLoading }) {
  if (isLoading) {
    return (
      <div className="card-raised p-6 sm:p-8">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!character) return null;

  return (
    <div className="card-raised p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple/10 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple to-indigo flex items-center justify-center text-3xl font-display text-white shrink-0 shadow-glow">
          {character.level}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wide text-gold mb-1">{character.title}</p>
          <p className="font-display text-xl text-ink mb-3">Level {character.level}</p>
          <ProgressBar value={character.xpIntoLevel} max={character.xpForNext} color="#8B5CF6" label="XP to next level" />
        </div>
        <Link to="/app/character" className="text-sm text-purple hover:text-ink shrink-0">
          View character →
        </Link>
      </div>
    </div>
  );
}
