import Modal from '../../../components/common/Modal.jsx';
import QuestForm from './QuestForm.jsx';

export default function AddQuestModal({ open, onClose, onCreate }) {
  return (
    <Modal open={open} onClose={onClose} title="New quest">
      <QuestForm submitLabel="Add quest" onCancel={onClose} onSubmit={async (data) => { await onCreate(data); onClose(); }} />
    </Modal>
  );
}
