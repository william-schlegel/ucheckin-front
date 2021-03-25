import PropTypes from 'prop-types';
import { BlueButtonStyled, NewButtonStyledBlock } from '../styles/Button';

export default function Button({ action, label, value, block }) {
  if (block)
    return (
      <NewButtonStyledBlock onClick={() => action(value)}>
        {label}
      </NewButtonStyledBlock>
    );
  return (
    <BlueButtonStyled onClick={() => action(value)}> {label} </BlueButtonStyled>
  );
}

Button.propTypes = {
  action: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  block: PropTypes.bool,
};
