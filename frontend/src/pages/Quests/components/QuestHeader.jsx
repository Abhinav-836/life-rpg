import PageHeader from '../../../components/common/PageHeader.jsx';
import Button from '../../../components/common/Button.jsx';

export default function QuestHeader({ onAddQuest }) {
  return (
    <PageHeader
      eyebrow="The Quest Board"
      title="Quests"
      description="Every task is a step toward the next level. Add one, or clear what's waiting."
      actions={<Button onClick={onAddQuest}>+ New quest</Button>}
    />
  );
}
