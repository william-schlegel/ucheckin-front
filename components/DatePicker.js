import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import Datepicker, { registerLocale } from 'react-datepicker'; // './Datepiker/Datepicker';
import fr from 'date-fns/locale/fr';

registerLocale('fr', fr);

export default function DatePicker({ ISOStringValue, onChange }) {
  const { lang } = useTranslation();

  return (
    <Datepicker
      selected={new Date(ISOStringValue)}
      onChange={onChange}
      locale={lang === 'fr' ? 'fr' : 'en-US'}
      dateFormat={lang === 'fr' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'}
    />
  );
}

export function formatDate(dt, locale) {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };

  const formatter = Intl.DateTimeFormat(locale, options);
  return formatter.format(new Date(dt));
}

DatePicker.propTypes = {
  ISOStringValue: PropTypes.string,
  onChange: PropTypes.func,
};
