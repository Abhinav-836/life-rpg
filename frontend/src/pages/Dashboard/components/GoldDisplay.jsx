import StatCard from '../../../components/common/StatCard.jsx';
import { formatGold } from '../../../utils/formatGold.js';

export default function GoldDisplay({ gold }) {
  return <StatCard label="Gold" value={formatGold(gold)} icon="⛁" accent="#F4C95D" />;
}
