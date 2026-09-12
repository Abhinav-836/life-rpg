import { useProfile } from '../../hooks/useProfile.js';
import { useCharacter } from '../../hooks/useCharacter.js';
import Loader from '../../components/common/Loader.jsx';
import ProfileHeader from './components/ProfileHeader.jsx';
import ProfileAvatar from './components/ProfileAvatar.jsx';
import AccountStats from './components/AccountStats.jsx';
import ProfileForm from './components/ProfileForm.jsx';
import ChangePassword from './components/ChangePassword.jsx';

export default function Profile() {
  const { data: profile, isLoading } = useProfile();
  const { data: character } = useCharacter();

  if (isLoading) return <Loader label="Loading profile…" size="lg" />;

  return (
    <div>
      <ProfileHeader />
      <div className="flex items-center gap-4 mb-2">
        <ProfileAvatar name={profile?.name} />
        <div>
          <p className="text-ink font-medium">{profile?.name}</p>
          <p className="text-sm text-ink-muted">{profile?.email}</p>
        </div>
      </div>
      <AccountStats character={character} />
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <ProfileForm profile={profile} />
        <ChangePassword />
      </div>
    </div>
  );
}
