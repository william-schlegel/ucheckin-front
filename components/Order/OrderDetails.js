import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';

import Drawer from '../Drawer';
import ButtonCancel from '../Buttons/ButtonCancel';
import { DrawerFooter } from '../styles/Drawer';
import OrderContent from './Order';

export default function OrderDetails({ open, onClose, id }) {
  const { t } = useTranslation('order');

  return (
    <Drawer onClose={onClose} open={open} title={t('order-details')}>
      <OrderContent id={id} />
      <DrawerFooter>
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
