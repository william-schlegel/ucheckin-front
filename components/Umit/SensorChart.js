import { useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';

import ButtonCancel from '../Buttons/ButtonCancel';
import { formatDate } from '../DatePicker';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import { Form, FormBodyFull, FormHeader, FormTitle } from '../styles/Card';
import { SENSOR_CHART_QUERY } from './Queries';

const ID_CHART = 'sensor-chart';

const emptyChart = {
  labels: [],
  datasets: [
    {
      label: 'measures',
      data: [],
      fill: true,
      borderColor: '#00f',
    },
    {
      label: 'alert',
      fill: false,
      borderColor: '#f00',
      data: [],
    },
  ],
};

export default function SensorChart({ open, onClose, id }) {
  const { loading, error, data } = useQuery(SENSOR_CHART_QUERY, {
    variables: { id },
  });
  const [dataChart, setDataChart] = useState();
  const { t } = useTranslation('umit');
  const dim = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const el = document.getElementById(ID_CHART);
    if (!el) return;
    const w = el.parentElement.clientWidth;
    dim.current.width = parseInt(w);
    dim.current.height = parseInt(w * 0.66);
  }, []);

  useEffect(() => {
    const d = emptyChart;
    if (data) {
      for (const m of data.umitMeasures) {
        d.labels.push(formatDate(m.measureDate));
        d.datasets[0].data.push(m.thickness);
        d.datasets[1].data.push(data.umitSensor.alert);
      }
    }
    console.log(`d`, d);
    setDataChart(d);
  }, [data]);

  if (loading) return <Loading />;
  if (!data) return null;
  if (!dataChart) return null;
  return (
    <Drawer onClose={onClose} open={open} title={t('sensor-chart')}>
      <Form>
        <FormHeader>
          <FormTitle>
            {t('sensor-name')} <span>{data.umitSensor?.name}</span>
          </FormTitle>
        </FormHeader>
        <FormBodyFull>
          <Line
            id={ID_CHART}
            data={dataChart}
            // width={dim.current.width}
            // height={dim.current.height}
            // style={{ width: '100%', height: '100%' }}
          />
        </FormBodyFull>
      </Form>

      <DrawerFooter>
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

SensorChart.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
