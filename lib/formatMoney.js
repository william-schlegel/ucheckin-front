export default function formatMoney(amount = 0, locale) {
  const options = {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  };
  const formatter = Intl.NumberFormat(locale, options);
  return formatter.format(amount);
}
