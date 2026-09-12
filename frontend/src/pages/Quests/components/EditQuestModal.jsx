import Modal from '../../../components/common/Modal.jsx';
import QuestForm from './QuestForm.jsx';

export default function EditQuestModal({ open, quest, onClose, onSave }) {
  if (!quest) return null;
  return (
    <Modal open={open} onClose={onClose} title="Edit quest">
      <QuestForm
        initial={quest}
        submitLabel="Save changes"
        onCancel={onClose}
        onSubmit={async (data) => { await onSave(quest.id, data); onClose(); }}
      />
    </Modal>
  );
}
