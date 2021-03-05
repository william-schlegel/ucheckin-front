import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import ActionButton from './ActionButton';
import { DeleteButtonStyled } from './styles/Button';

export default function DeleteButton({ onClick, disabled }) {
  const { t } = useTranslation('common');
  return (
    <DeleteButtonStyled type="button" disabled={disabled} onClick={onClick}>
      <>
        <ActionButton type="trash" label={t('delete')} cb={onClick} />
        {t('delete')}
      </>
    </DeleteButtonStyled>
  );
}

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
