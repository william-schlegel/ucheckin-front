import PropTypes from 'prop-types';
import BadgeStyle from '../styles/Badge';

export default function Badge({ label }) {
  return <BadgeStyle>{label}</BadgeStyle>;
}

Badge.propTypes = {
  label: PropTypes.string.isRequired,
};
