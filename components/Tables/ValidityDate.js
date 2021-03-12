import PropTypes from 'prop-types';
import { formatDate } from '../DatePicker';

export default function ValidityDate({ value }) {
  return <span>{formatDate(value)}</span>;
}

ValidityDate.propTypes = {
  value: PropTypes.string.isRequired,
};
