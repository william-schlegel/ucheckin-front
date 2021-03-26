import PropTypes from 'prop-types';
import {
  PrimaryButtonStyled,
  NewButtonStyledBlock,
  SecondaryButtonStyled,
  NewButtonStyledBlockSecondary,
} from '../styles/Button';

export default function Button({ action, label, value, block, secondary }) {
  if (block)
    return secondary ? (
      <NewButtonStyledBlockSecondary onClick={() => action(value)}>
        {label}
      </NewButtonStyledBlockSecondary>
    ) : (
      <NewButtonStyledBlock onClick={() => action(value)}>
        {label}
      </NewButtonStyledBlock>
    );
  return secondary ? (
    <SecondaryButtonStyled onClick={() => action(value)}>
      {' '}
      {label}{' '}
    </SecondaryButtonStyled>
  ) : (
    <PrimaryButtonStyled onClick={() => action(value)}>
      {' '}
      {label}{' '}
    </PrimaryButtonStyled>
  );
}

Button.propTypes = {
  action: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  block: PropTypes.bool,
  secondary: PropTypes.bool,
};
