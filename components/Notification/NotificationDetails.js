import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';

import styled from 'styled-components';
import Drawer, { DrawerFooter } from '../Drawer';
import ButtonCancel from '../Buttons/ButtonCancel';
import {
  Block,
  Form,
  FormBodyFull,
  FormHeader,
  FormTitle,
  Label,
  RowReadOnly,
  Separator,
} from '../styles/Card';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import { NOTIFICATION_QUERY } from './Queries';
import NotificationType from '../Tables/NotificationType';
import ValidityDate from '../Tables/ValidityDate';
import ActionButton from '../Buttons/ActionButton';
import { Notif } from './Notification';

export default function NotificationDetails({ open, onClose, id }) {
  const { loading, error, data } = useQuery(NOTIFICATION_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('notification');
  const router = useRouter();

  if (loading) return <Loading />;
  if (error) return <DisplayError />;
  if (!data) return null;
  return (
    <Drawer onClose={onClose} open={open} title={t('notification-details')}>
      <Form>
        <FormHeader>
          <FormTitle>
            {t('notification')} <span>{data.notification.name}</span>
          </FormTitle>
        </FormHeader>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('name')}</Label>
            <span>{data.notification.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('display-name')}</Label>
            <span>{data.notification.displayName}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('type')}</Label>
            <NotificationType notification={data.notification.type} />
          </RowReadOnly>
          <RowReadOnly>
            <Block>
              <Label>{t('application')}</Label>
              <span>{data.notification.application?.name}</span>
              <ActionButton
                type="view"
                cb={() =>
                  router.push(
                    `/application/${data.notification.application?.id}`
                  )
                }
                label={t('navigation:application')}
              />
            </Block>
          </RowReadOnly>
          <RowReadOnly>
            <Block>
              <Label>{t('signal')}</Label>
              <span>{data.notification.signal?.name}</span>
              <ActionButton
                type="signal"
                cb={() =>
                  router.push(`/signal/${data.notification.signal?.id}`)
                }
                label={t('common:signal')}
              />
            </Block>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('start-date')}</Label>
            <ValidityDate value={data.notification.startDate} after />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('end-date')}</Label>
            <ValidityDate value={data.notification.endDate} />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('nb-notif')}</Label>
            <span>{data.notification.items.length}</span>
          </RowReadOnly>
          <Separator />
          <NotifContainer>
            {data.notification.items.map((it) => (
              <Notif
                style={{ maxWidth: '100px' }}
                key={it.id}
                typeNotif={data.notification.type}
                item={it}
              />
            ))}
          </NotifContainer>
        </FormBodyFull>
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

const NotifContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: row;
  flex-wrap: wrap;
`;
