import { useSettings, useUpdateSettings } from '../../hooks/useSettings.js';
import { useToast } from '../../components/common/Toast.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Loader from '../../components/common/Loader.jsx';
import AccountSettings from './components/AccountSettings.jsx';
import ThemeSettings from './components/ThemeSettings.jsx';
import SoundSettings from './components/SoundSettings.jsx';
import NotificationSettings from './components/NotificationSettings.jsx';
import DangerZone from './components/DangerZone.jsx';

export default function Settings() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const toast = useToast();

  if (isLoading || !settings) return <Loader label="Loading settings…" size="lg" />;

  async function handleThemeChange(theme) {
    await updateSettings.mutateAsync({ theme });
    toast('Theme updated.', 'success');
  }

  async function handleSoundToggle() {
    await updateSettings.mutateAsync({ soundEnabled: !settings.soundEnabled });
    toast(settings.soundEnabled ? 'Sound effects off.' : 'Sound effects on.', 'success');
  }

  async function handleNotificationToggle(key) {
    await updateSettings.mutateAsync({ notifications: { [key]: settings.notifications?.[key] === false } });
    toast('Preference saved.', 'success');
  }

  return (
    <div>
      <PageHeader eyebrow="Preferences" title="Settings" />
      <div className="space-y-6 max-w-2xl">
        <AccountSettings />
        <ThemeSettings theme={settings.theme} onChange={handleThemeChange} />
        <SoundSettings enabled={settings.soundEnabled} onToggle={handleSoundToggle} />
        <NotificationSettings notifications={settings.notifications} onToggle={handleNotificationToggle} />
        <DangerZone />
      </div>
    </div>
  );
}