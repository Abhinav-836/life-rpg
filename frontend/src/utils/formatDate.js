export function formatDate(input, opts = {}) {
  if (!input) return '';
  const d = new Date(input);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', ...opts });
}

export function formatRelative(input) {
  if (!input) return '';
  const d = new Date(input);
  const diffMs = d.getTime() - Date.now();
  const diffDays = Math.round(diffMs / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays > -7) return `${Math.abs(diffDays)} days ago`;
  return formatDate(d);
}
