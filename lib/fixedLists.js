export function getLicenseName(code) {
  if (code === 'NONE') return 'none';
  if (code === 'UCHECKIN') return 'ucheck-in';
  if (code === 'WIUS') return 'wi-us';
  return `license-unkown ${code}`;
}
