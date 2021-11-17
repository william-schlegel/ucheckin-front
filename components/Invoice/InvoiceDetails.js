import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useState } from 'react';

import ActionButton from '../Buttons/ActionButton';
import ButtonCancel from '../Buttons/ButtonCancel';
import Drawer, { DrawerFooter } from '../Drawer';
import { SecondaryButtonStyled } from '../styles/Button';
import OrderContent from './Invoice';

export default function OrderDetails({ open, onClose, id }) {
  const { t } = useTranslation('invoice');
  const [print, setPrint] = useState(false);

  function printInvoice() {
    setPrint(true);
  }

  return (
    <Drawer onClose={onClose} open={open} title={t('invoice-details')}>
      <OrderContent id={id} print={print} setPrint={setPrint} />
      <DrawerFooter>
        <SecondaryButtonStyled onClick={printInvoice}>
          <ActionButton type="printer" size="25" />
          {t('print')}
        </SecondaryButtonStyled>
        <ButtonCancel onClick={onClose} />
      </DrawerFooter>
    </Drawer>
  );
}

OrderDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
