export function formatNumber(value: string): string {
  const num = parseFloat(value);
  if (num >= 1000) {
    return num.toLocaleString();
  }
  return value;
}
