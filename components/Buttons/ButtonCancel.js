import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import ActionButton from './ActionButton';
import { CancelButtonStyled } from '../styles/Button';

export default function CancelButton({ onClick }) {
  const { t } = useTranslation('common');
  return (
    <CancelButtonStyled type="button" onClick={onClick}>
      <>
        <ActionButton type="delete" label={t('cancel')} cb={onClick} />
        {t('cancel')}
      </>
    </CancelButtonStyled>
  );
}

CancelButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
