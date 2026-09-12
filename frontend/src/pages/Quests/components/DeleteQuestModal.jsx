import { useState } from 'react';
import ConfirmDialog from '../../../components/common/ConfirmDialog.jsx';

export default function DeleteQuestModal({ open, quest, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm(quest.id);
    } finally {
      setLoading(false);
      onClose();
    }
  }

  return (
    <ConfirmDialog
      open={open}
      title="Abandon this quest?"
      description={quest ? `"${quest.title}" will be removed permanently. This can't be undone.` : ''}
      confirmLabel="Delete"
      danger
      loading={loading}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
}
