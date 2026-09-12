import { useAuth } from '../../hooks/useAuth.js';
import { useCharacter } from '../../hooks/useCharacter.js';
import { useInventory } from '../../hooks/useInventory.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import Loader from '../../components/common/Loader.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import CharacterDisplay from './components/CharacterDisplay.jsx';
import CharacterStats from './components/CharacterStats.jsx';
import EquipmentDisplay from './components/EquipmentDisplay.jsx';
import CharacterCustomization from './components/CharacterCustomization.jsx';

export default function Character() {
  const { user } = useAuth();
  const { data: character, isLoading, isError, refetch } = useCharacter();
  const { data: inventory } = useInventory();

  return (
    <div>
      <PageHeader eyebrow="Your Hero" title="Character" description="Everything you've earned, all in one place." />

      {isLoading && <Loader label="Summoning your character…" size="lg" />}
      {isError && <ErrorMessage message="Couldn't load your character." onRetry={refetch} />}

      {character && (
        <div className="space-y-6">
          <CharacterDisplay character={character} userName={user?.name} />
          <div className="grid lg:grid-cols-2 gap-6">
            <CharacterStats attributes={character.attributes} />
            <div className="space-y-6">
              <EquipmentDisplay equippedItems={(inventory || []).filter((i) => i.equipped)} />
              <CharacterCustomization />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
