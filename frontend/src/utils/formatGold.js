export function formatGold(value) {
  return new Intl.NumberFormat(undefined).format(value);
}
