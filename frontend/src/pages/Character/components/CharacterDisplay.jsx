import CharacterAvatar from './CharacterAvatar.jsx';
import CharacterLevel from './CharacterLevel.jsx';
import XPBar from './XPBar.jsx';

export default function CharacterDisplay({ character, userName }) {
  return (
    <div className="card-raised p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
        <CharacterAvatar name={userName} level={character.level} />
        <div className="flex-1 min-w-0">
          <p className="text-ink-muted text-sm mb-1">{userName}</p>
          <CharacterLevel level={character.level} title={character.title} />
          <div className="mt-4 max-w-md">
            <XPBar xpIntoLevel={character.xpIntoLevel} xpForNext={character.xpForNext} totalXP={character.totalXP} />
          </div>
        </div>
      </div>
    </div>
  );
}
