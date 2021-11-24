import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import useTranslation from 'next-translate/useTranslation';

import Dashboard from '../Dashboard';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import Button from '../Tables/Button';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';

const nbSensor = 5;

const QUERY_SENSORS = gql`
  query QUERY_SENSORS {
    umitSensors(take:${nbSensor} , orderBy: {modificationDate: desc}) {
      id
      name
      description
      lastMeasureAt
    }
    umitSensorsCount
  }
`;

export default function DashboardSensor() {
  const { t } = useTranslation('dashboard');
  const { error, loading, data } = useQuery(QUERY_SENSORS);
  const router = useRouter();

  function viewSensor(sensorId) {
    router.push(`/umit/sensor/${sensorId}`);
  }

  const columns = useColumns(
    [
      ['id', 'id', 'hidden'],
      [
        t('common:name'),
        'name',
        ({
          column: {
            options: { action },
          },
          cell: { value },
          row: {
            values: { id },
          },
        }) => <Button action={action} label={value} value={id} block />,
        { action: viewSensor },
      ],
      [t('common:description'), 'description'],
      [
        t('umit:last-measure'),
        'lastMeasureAt',
        ({ cell: { value } }) => <ValidityDate value={value} noColor />,
      ],
    ],
    false
  );

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <Dashboard
      title={t('sensors', { count: data.umitSensors.length })}
      total={t('sensors-total')}
      count={data.umitSensorsCount}
    >
      <Table columns={columns} data={data.umitSensors} />
    </Dashboard>
  );
}
