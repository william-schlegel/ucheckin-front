import { useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import ButtonCancel from '../Buttons/ButtonCancel';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import { Form, FormBodyFull, FormHeader, FormTitle, Label, RowReadOnly } from '../styles/Card';
import ValidityDate from '../Tables/ValidityDate';
import DessinCourbe from './DessinCourbe';
import { MEASURE_QUERY } from './Queries';

export default function MeasureDetails({ open, onClose, id }) {
  const { loading, error, data } = useQuery(MEASURE_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('umit');

  if (loading) return <Loading />;
  if (!data) return null;
  return (
    <Drawer onClose={onClose} open={open} title={t('measure-details')}>
      <Form>
        <FormHeader>
          <FormTitle>
            {t('measure-name')} <span>{data.umitMeasure.sensor.name}</span>
          </FormTitle>
        </FormHeader>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('measure-date')}</Label>
            <ValidityDate value={data.umitMeasure.measureDate} noColor />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('thickness')}</Label>
            <span
              style={{
                fontSize: '1.5rem',
                color: data.umitMeasure.thickness < data.umitMeasure.sensor.alert ? 'red' : 'green',
              }}>
              {data.umitMeasure.thickness} mm
            </span>
          </RowReadOnly>
          <RowReadOnly>
            <DessinCourbe points={data.umitMeasure.points} dataMesure={data.umitMeasure} />
          </RowReadOnly>
        </FormBodyFull>
      </Form>
      <Form>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('company')}</Label>
            <span>{data.umitMeasure.company}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('location')}</Label>
            <span>{data.umitMeasure.location.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('building')}</Label>
            <span>{data.umitMeasure.sensor.building}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('unit')}</Label>
            <span>{data.umitMeasure.sensor.unit}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('ref')}</Label>
            <span>{data.umitMeasure.sensor.ref}</span>
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
            <span>{data.umitMeasure.startA} µs</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('width')} A</Label>
            <span>{data.umitMeasure.widthA} µs</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('threshold')} A</Label>
            <span>{data.umitMeasure.thresholdA} %</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('start')} B</Label>
            <span>{data.umitMeasure.startB} µs</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('width')} B</Label>
            <span>{data.umitMeasure.widthB} µs</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('threshold')} B</Label>
            <span>{data.umitMeasure.thresholdB} %</span>
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

MeasureDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
