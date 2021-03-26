import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import ActionButton from './ActionButton';
import { PrimaryButtonStyled } from '../styles/Button';

export default function NewButton({ onClick, disabled, label }) {
  const { t } = useTranslation('common');
  return (
    <PrimaryButtonStyled type="button" disabled={disabled} onClick={onClick}>
      <>
        <ActionButton type="plus" label={label || t('new')} cb={onClick} />
        {label || t('new')}
      </>
    </PrimaryButtonStyled>
  );
}

NewButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string,
};
