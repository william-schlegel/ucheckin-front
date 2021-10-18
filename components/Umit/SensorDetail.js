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
      <Form>
        <FormHeader>
          <FormTitle>
            {t('sensor-name')} <span>{data.umitSensor.name}</span>
          </FormTitle>
        </FormHeader>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('company')}</Label>
            <span>{data.umitSensor.company}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('location')}</Label>
            <span>{data.umitSensor.location.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('description')}</Label>
            <span>{data.umitSensor.description}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('building')}</Label>
            <span>{data.umitSensor.building}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('unit')}</Label>
            <span>{data.umitSensor.unit}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('ref')}</Label>
            <span>{data.umitSensor.ref}</span>
          </RowReadOnly>
        </FormBodyFull>
      </Form>
      <Form>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('last-measure')}</Label>
            {data.umitSensor.lastMeasureAt ? (
              <ValidityDate value={data.umitSensor.lastMeasureAt} noColor />
            ) : (
              t('never-settled')
            )}
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('mac-address')}</Label>
            <span>{data.umitSensor.macAddress}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('frequency')}</Label>
            <span>{parseFloat(data.umitSensor.frequency) / 1e6} MHz</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('material-name')}</Label>
            <span>{data.umitSensor.material.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('prop-speed')}</Label>
            <span>{data.umitSensor.propSpeed} m/s</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('alert')}</Label>
            <span>{data.umitSensor.alert} mm</span>
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
            <span>{data.umitSensor.startA} µs</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('width')} A</Label>
            <span>{data.umitSensor.widthA} µs</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('threshold')} A</Label>
            <span>{data.umitSensor.thresholdA} %</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('start')} B</Label>
            <span>{data.umitSensor.startB} µs</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('width')} B</Label>
            <span>{data.umitSensor.widthB} µs</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('threshold')} B</Label>
            <span>{data.umitSensor.thresholdB} %</span>
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

SensorDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
