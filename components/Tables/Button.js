import PropTypes from 'prop-types';
import { NewButtonStyled } from '../styles/Button';

export default function Button({ action, label, value }) {
  return (
    <NewButtonStyled onClick={() => action(value)}>{label}</NewButtonStyled>
  );
}

Button.propTypes = {
  action: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
