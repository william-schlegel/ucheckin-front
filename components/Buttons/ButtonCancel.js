import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import ActionButton from './ActionButton';
import { CancelButtonStyled } from '../styles/Button';

export default function CancelButton({ onClick, label, disabled }) {
  const { t } = useTranslation('common');
  const cancelLabel = label || t('cancel');
  return (
    <CancelButtonStyled disabled={disabled} type="button" onClick={onClick}>
      <>
        <ActionButton type="delete" label={cancelLabel} cb={onClick} />
        {cancelLabel}
      </>
    </CancelButtonStyled>
  );
}

CancelButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};
