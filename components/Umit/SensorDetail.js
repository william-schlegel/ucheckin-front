import { useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import ButtonCancel from '../Buttons/ButtonCancel';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import { Form, FormBodyFull, FormHeader, FormTitle, Label, RowReadOnly } from '../styles/Card';
import ValidityDate from '../Tables/ValidityDate';
import { SENSOR_QUERY } from './Queries';

export default function SensorDetails({ open, onClose, id }) {
  const { loading, error, data } = useQuery(SENSOR_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('umit');

  if (loading) return <Loading />;
  if (!data) return null;
  return (
    <Drawer onClose={onClose} open={open} title={t('sensor-details')}>
      <SensorContent data={data.umitSensor} header />
      <DrawerFooter>
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

SensorDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export function SensorContent({ data, header = false }) {
  const { t } = useTranslation('umit');

  return (
    <>
      <Form>
        {header && (
          <FormHeader>
            <FormTitle>
              {t('sensor-name')} <span>{data.name}</span>
            </FormTitle>
          </FormHeader>
        )}
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('company')}</Label>
            <span>{data.company}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('location')}</Label>
            <span>{data.location?.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('description')}</Label>
            <span>{data.description}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('building')}</Label>
            <span>{data.building}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('unit')}</Label>
            <span>{data.unit}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('ref')}</Label>
            <span>{data.ref}</span>
          </RowReadOnly>
        </FormBodyFull>
      </Form>
      <Form>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('last-measure')}</Label>
            {data.lastMeasureAt ? (
              <ValidityDate value={data.lastMeasureAt} noColor />
            ) : (
              t('never-settled')
            )}
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('mac-address')}</Label>
            <span>{data.macAddress}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('frequency')}</Label>
            <span>{parseFloat(data.frequency)} MHz</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('material-name')}</Label>
            <span>{data.material?.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('prop-speed')}</Label>
            <span>{data.propSpeed} m/s</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('alert')}</Label>
            <span>{data.alert} mm</span>
          </RowReadOnly>
        </FormBodyFull>
      </Form>
      <Form>
        <FormBodyFull>
          <FormHeader>
            <FormTitle>{t('settings')}</FormTitle>
          </FormHeader>
          <RowReadOnly>
            <Label>{t('start')} A</Label>
            <span>{data.startA} µs</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('width')} A</Label>
            <span>{data.widthA} µs</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('threshold')} A</Label>
            <span>{data.thresholdA} %</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('start')} B</Label>
            <span>{data.startB} µs</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('width')} B</Label>
            <span>{data.widthB} µs</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('threshold')} B</Label>
            <span>{data.thresholdB} %</span>
          </RowReadOnly>
        </FormBodyFull>
      </Form>
    </>
  );
}
