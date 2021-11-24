import { useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { calculCourbe } from '../../lib/maths';
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
      <MeasureContent data={data.umitMeasure} header />
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

export function MeasureContent({ data, header }) {
  const { t } = useTranslation('umit');
  const [points, setPoints] = useState([]);

  useEffect(() => {
    if (data?.points) setPoints(calculCourbe(data.points));
  }, [data?.points]);

  return (
    <>
      <Form>
        {header && (
          <FormHeader>
            <FormTitle>
              {t('measure-name')} <span>{data.sensor?.name}</span>
            </FormTitle>
          </FormHeader>
        )}
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('measure-date')}</Label>
            <ValidityDate value={data.measureDate} noColor />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('thickness')}</Label>
            <span
              style={{
                fontSize: '1.5rem',
                color: data.sensor?.alert
                  ? data.thickness < data.sensor.alert
                    ? 'red'
                    : 'green'
                  : 'black',
              }}
            >
              {data.thickness.toFixed(2)} mm
            </span>
          </RowReadOnly>
          <RowReadOnly>
            <DessinCourbe points={points} dataMesure={data} />
          </RowReadOnly>
        </FormBodyFull>
      </Form>
      <Form>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('company')}</Label>
            <span>{data.company}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('location')}</Label>
            <span>{data.location.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('building')}</Label>
            <span>{data.sensor?.building}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('unit')}</Label>
            <span>{data.sensor?.unit}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('ref')}</Label>
            <span>{data.sensor?.ref}</span>
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
