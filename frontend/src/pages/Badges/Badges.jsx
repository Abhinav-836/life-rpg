import { useState } from 'react';
import { useBadges } from '../../hooks/useBadges.js';
import BadgeHeader from './components/BadgeHeader.jsx';
import BadgeGrid from './components/BadgeGrid.jsx';
import BadgeDetails from './components/BadgeDetails.jsx';

export default function Badges() {
  const { data: badges, isLoading } = useBadges();
  const [open, setOpen] = useState(null);

  return (
    <div>
      <BadgeHeader />
      <BadgeGrid badges={badges || []} isLoading={isLoading} onOpen={setOpen} />
      <BadgeDetails badge={open} onClose={() => setOpen(null)} />
    </div>
  );
}
