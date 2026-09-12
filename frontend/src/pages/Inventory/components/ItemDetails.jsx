import { formatRelative } from '../../../utils/formatDate.js';

export default function ItemDetails({ item }) {
  return (
    <p className="text-xs text-ink-faint">Acquired {formatRelative(item.acquiredAt)}</p>
  );
}
