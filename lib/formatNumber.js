export function formatMoney(amount = 0, locale) {
  const options = {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  };
  const formatter = Intl.NumberFormat(locale, options);
  return formatter.format(amount);
}

export function formatPrct(percentage = 0, locale) {
  const options = {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  };
  const formatter = Intl.NumberFormat(locale, options);
  return formatter.format(percentage);
}

export function formatNumber(number = 0, locale, decimals = 0) {
  const options = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: Math.max(1, decimals),
  };
  // console.log(`options`, options);
  const formatter = Intl.NumberFormat(locale, options);
  return formatter.format(number);
}
