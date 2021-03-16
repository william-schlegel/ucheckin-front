import PropTypes from 'prop-types';
import { NewButtonStyled, NewButtonStyledBlock } from '../styles/Button';

export default function Button({ action, label, value, block }) {
  if (block)
    return (
      <NewButtonStyledBlock onClick={() => action(value)}>
        {label}
      </NewButtonStyledBlock>
    );
  return (
    <NewButtonStyled onClick={() => action(value)}> {label} </NewButtonStyled>
  );
}

Button.propTypes = {
  action: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  block: PropTypes.bool,
};
