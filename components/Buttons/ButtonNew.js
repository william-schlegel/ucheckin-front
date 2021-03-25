import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import ActionButton from './ActionButton';
import { BlueButtonStyled } from '../styles/Button';

export default function NewButton({ onClick, disabled, label }) {
  const { t } = useTranslation('common');
  return (
    <BlueButtonStyled type="button" disabled={disabled} onClick={onClick}>
      <>
        <ActionButton type="plus" label={label || t('new')} cb={onClick} />
        {label || t('new')}
      </>
    </BlueButtonStyled>
  );
}

NewButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string,
};
