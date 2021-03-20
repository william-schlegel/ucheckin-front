import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import ActionButton from './ActionButton';
import { PaymentButtonStyled } from '../styles/Button';

export default function DeleteButton({ onClick, disabled }) {
  const { t } = useTranslation('common');
  return (
    <PaymentButtonStyled type="button" disabled={disabled} onClick={onClick}>
      <>
        <ActionButton type="credit-card" label={t('payment')} cb={onClick} />
        {t('payment')}
      </>
    </PaymentButtonStyled>
  );
}

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
