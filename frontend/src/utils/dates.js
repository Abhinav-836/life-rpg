// Date keys ("YYYY-MM-DD") in the player's LOCAL timezone.
//
// toISOString() returns UTC, so for a player in India anything done
// between midnight and 5:30 AM was filed under the previous day.

export function toLocalDateKey(input = new Date()) {
  const d = input instanceof Date ? input : new Date(input);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// The last n local days, oldest first, ending today.
export function lastNDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return toLocalDateKey(d);
  });
}