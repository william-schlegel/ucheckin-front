import { useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import ActionButton from '../Buttons/ActionButton';
import ButtonCancel from '../Buttons/ButtonCancel';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import {
  Block,
  Form,
  FormBodyFull,
  FormHeader,
  FormTitle,
  H3,
  Label,
  RowReadOnly,
} from '../styles/Card';
import Phone from '../styles/Phone';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';
import EventContent from './EventContent';
import EventHome from './EventHome';
import { EVENT_QUERY } from './Queries';

export default function EventDetails({ open, onClose, id }) {
  const { loading, error, data } = useQuery(EVENT_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('event');
  const router = useRouter();
  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [t('name'), 'name'],
  ]);

  function viewNotification(id) {
    router.push(`/notification/${id}`);
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError />;
  if (!data) return null;
  return (
    <Drawer onClose={onClose} open={open} title={t('event-details')}>
      <Form>
        <FormHeader>
          <FormTitle>
            {t('event')} <span>{data.event.name}</span>
            {data.event.privateEvent && (
              <span style={{ color: 'var(--primary)' }}>({t('private')})</span>
            )}
          </FormTitle>
        </FormHeader>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('publish-start')}</Label>
            <ValidityDate value={data.event.publishStart} after />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('publish-end')}</Label>
            <ValidityDate value={data.event.publishEnd} />
          </RowReadOnly>
          <EventHome event={data.event} />
          <Phone>
            <EventContent event={data.event} />
          </Phone>
          <RowReadOnly>
            <Block>
              <Label>{t('application')}</Label>
              <span>{data.event.application?.name}</span>
              <ActionButton
                type="view"
                cb={() => router.push(`/application/${data.event.application?.id}`)}
                label={t('navigation:application')}
              />
            </Block>
          </RowReadOnly>
          <H3>{t('notifications')}</H3>
          <Table
            columns={columns}
            data={data?.event?.notifications}
            actionButtons={[{ type: 'view', action: viewNotification }]}
          />
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonCancel onClick={onClose} />
      </DrawerFooter>
    </Drawer>
  );
}

EventDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
