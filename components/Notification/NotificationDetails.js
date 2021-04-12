import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { useQuery } from '@apollo/client';

import Drawer, { DrawerFooter } from '../Drawer';
import ButtonCancel from '../Buttons/ButtonCancel';
import { Form, FormHeader, FormTitle } from '../styles/Card';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import { NOTIFICATION_QUERY } from './Queries';

export default function NotificationDetails({ open, onClose, id }) {
  const { loading, error, data } = useQuery(NOTIFICATION_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('notification');

  if (loading) return <Loading />;
  if (error) return <DisplayError />;
  if (!data) return null;
  return (
    <Drawer onClose={onClose} open={open} title={t('notification-details')}>
      <Form>
        <FormHeader>
          <FormTitle>
            {t('notification')} <span>{data.Notification.name}</span>
          </FormTitle>
        </FormHeader>
      </Form>
      <DrawerFooter>
        <ButtonCancel onClick={onClose} />
      </DrawerFooter>
    </Drawer>
  );
}

NotificationDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
