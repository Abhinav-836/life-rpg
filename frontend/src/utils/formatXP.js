export function formatXP(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k XP`;
  return `${value} XP`;
}
