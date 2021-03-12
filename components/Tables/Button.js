import PropTypes from 'prop-types';
import { NewButtonStyled } from '../styles/Button';

export default function Button({ action, value }) {
  return (
    <NewButtonStyled onClick={() => action(value)}>{value}</NewButtonStyled>
  );
}

Button.propTypes = {
  action: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
