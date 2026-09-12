import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateQuest } from '../../../hooks/useTasks.js';
import { useToast } from '../../../components/common/Toast.jsx';
import Button from '../../../components/common/Button.jsx';
import AddQuestModal from '../../Quests/components/AddQuestModal.jsx';

export default function QuickActions() {
  const [open, setOpen] = useState(false);
  const createQuest = useCreateQuest();
  const toast = useToast();
  const navigate = useNavigate();

  return (
    <div className="card p-5 flex flex-col gap-2.5">
      <h2 className="font-display text-ink text-base mb-1.5">Quick actions</h2>
      <Button onClick={() => setOpen(true)} className="w-full">+ Add quest</Button>
      <Button variant="ghost" className="w-full" onClick={() => navigate('/app/rewards')}>Visit the shop</Button>

      <AddQuestModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={async (data) => {
          await createQuest.mutateAsync(data);
          toast('Quest added to your board.', 'success');
        }}
      />
    </div>
  );
}
