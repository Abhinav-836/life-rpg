import { Link } from 'react-router-dom';
import { useCharacter } from '../../hooks/useCharacter.js';
import ProgressBar from '../common/ProgressBar.jsx';

export default function Navbar() {
  const { data: character, isLoading } = useCharacter();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-surface/25 backdrop-blur-xl px-4 sm:px-6 py-3">
      <Link to="/app" className="md:hidden font-display text-white text-lg font-bold tracking-wider drop-shadow-md">Life RPG</Link>

      {!isLoading && character && (
        <div className="flex items-center gap-4 ml-auto">
          <div className="hidden sm:block w-40">
            <ProgressBar value={character.xpIntoLevel} max={character.xpForNext} color="#8B5CF6" showLabel={false} height="h-2" />
          </div>
          <span className="text-xs text-gray-200 hidden sm:inline drop-shadow-sm font-medium">Lv. {character.level}</span>
          <span className="flex items-center gap-1 text-sm text-gold font-semibold drop-shadow-sm" aria-label={`${character.gold} gold`}>
            <span aria-hidden="true">⛁</span> {character.gold}
          </span>
        </div>
      )}
    </header>
  );
}
