import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';

import Drawer, { DrawerFooter } from '../Drawer';
import ButtonCancel from '../Buttons/ButtonCancel';
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
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import { EVENT_QUERY } from './Queries';
import ValidityDate from '../Tables/ValidityDate';
import ActionButton from '../Buttons/ActionButton';
import EventHome from './EventHome';
import EventContent from './EventContent';
import Phone from '../styles/Phone';

export default function EventDetails({ open, onClose, id }) {
  const { loading, error, data } = useQuery(EVENT_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('event');
  const router = useRouter();

  if (loading) return <Loading />;
  if (error) return <DisplayError />;
  if (!data) return null;
  return (
    <Drawer onClose={onClose} open={open} title={t('event-details')}>
      <Form>
        <FormHeader>
          <FormTitle>
            {t('event')} <span>{data.event.name}</span>
          </FormTitle>
        </FormHeader>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('name')}</Label>
            <span>{data.event.name}</span>
          </RowReadOnly>
          <H3>{t('home')}</H3>
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
                cb={() =>
                  router.push(`/application/${data.event.application?.id}`)
                }
                label={t('navigation:application')}
              />
            </Block>
          </RowReadOnly>
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
