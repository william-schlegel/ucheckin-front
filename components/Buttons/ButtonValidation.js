import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import ActionButton from './ActionButton';
import { ValidationButtonStyled } from '../styles/Button';

export default function ValidationButton({ onClick, disabled, update }) {
  const { t } = useTranslation('common');
  const label = update ? t('update') : t('save');
  return (
    <ValidationButtonStyled type="button" disabled={disabled} onClick={onClick}>
      <>
        <ActionButton type="check" label={label} cb={onClick} />
        {label}
      </>
    </ValidationButtonStyled>
  );
}

ValidationButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  update: PropTypes.bool,
};
