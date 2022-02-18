import fr from 'date-fns/locale/fr';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import Datepicker, { registerLocale } from 'react-datepicker'; // './Datepiker/Datepicker';

registerLocale('fr', fr);

export default function DatePicker({ ISOStringValue, onChange, withTime }) {
  const { lang } = useTranslation();

  return (
    <Datepicker
      selected={new Date(ISOStringValue)}
      onChange={(dt) => {
        if (withTime) {
          onChange(dt);
        } else {
          const value = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 12);
          console.log(`DatePicker`, value);
          onChange(value);
        }
      }}
      locale={lang === 'fr' ? 'fr' : 'en-US'}
      dateFormat={`${lang === 'fr' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'}${withTime ? ' HH:mm' : ''}`}
      showTimeSelect={withTime}
    />
  );
}

export function dateNow() {
  return new Date().toISOString();
}

export function dateDay() {
  const dt = new Date();
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).toISOString();
}

export function dateInMonth(nbMonth = 1) {
  const dt = new Date();
  return new Date(dt.getFullYear(), dt.getMonth() + nbMonth, dt.getDate()).toISOString();
}

export function dateInDay(nbDay = 1) {
  const dt = new Date();
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + nbDay).toISOString();
}

export function formatDate(dt, locale, withTime) {
  if (!dt) return '';
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  if (withTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
  }
  const formatter = Intl.DateTimeFormat(locale, options);
  return formatter.format(new Date(dt));
}

DatePicker.propTypes = {
  ISOStringValue: PropTypes.string,
  onChange: PropTypes.func,
  withTime: PropTypes.bool,
};
