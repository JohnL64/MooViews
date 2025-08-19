export function formatRating(value) {
  const num = Number(value);
  if (isNaN(num)) return '';

  return (Math.round(num * 10) / 10).toFixed(1);
}