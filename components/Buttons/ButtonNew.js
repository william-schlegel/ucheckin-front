import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import ActionButton from './ActionButton';
import { NewButtonStyled } from '../styles/Button';

export default function NewButton({ onClick, disabled }) {
  const { t } = useTranslation('common');
  return (
    <NewButtonStyled type="button" disabled={disabled} onClick={onClick}>
      <>
        <ActionButton type="plus" label={t('new')} cb={onClick} />
        {t('new')}
      </>
    </NewButtonStyled>
  );
}

NewButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
