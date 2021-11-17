import { useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import ButtonCancel from '../Buttons/ButtonCancel';
import { formatDate } from '../DatePicker';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import { Form, FormBodyFull, FormHeader, FormTitle, Label, RowReadOnly } from '../styles/Card';
import { STATISTIC_QUERY } from './Queries';

export default function StatisticDetails({ open, onClose, id }) {
  const { loading, error, data } = useQuery(STATISTIC_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('statistic');

  if (loading) return <Loading />;
  if (!data) return null;
  return (
    <Drawer onClose={onClose} open={open} title={t('statistic-details')}>
      <Form>
        <FormHeader>
          <FormTitle>{t('statistic')}</FormTitle>
        </FormHeader>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('date')}</Label>
            <span> {formatDate(data.statistic.date)} </span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('os')}</Label>
            <span>{data.statistic.os}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('model')}</Label>
            <span>{data.statistic.model}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('version')}</Label>
            <span>{data.statistic.version}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('signal')}</Label>
            <span>{data.statistic.signal?.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('application')}</Label>
            <span>{data.statistic.application.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('chanel')}</Label>
            <span>{data.statistic.chanel}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('uuid')}</Label>
            <span>{data.statistic.uuid}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('extra')}</Label>
            <span>{data.statistic.extra}</span>
          </RowReadOnly>
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

StatisticDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
