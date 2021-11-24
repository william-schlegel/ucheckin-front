import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import useTranslation from 'next-translate/useTranslation';

import Dashboard from '../Dashboard';
import { formatDate } from '../DatePicker';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import Button from '../Tables/Button';
import NumberField from '../Tables/Number';
import Table, { useColumns } from '../Tables/Table';

const nbMeasure = 5;

const QUERY_MEASURES = gql`
  query QUERY_MEASURES {
    umitMeasures(take:${nbMeasure} , orderBy: {measureDate: desc}) {
      id
      measureDate
      thickness
      sensor {
        name
      }
    }
    umitMeasuresCount
  }
`;

export default function DashboardMeasure() {
  const { t } = useTranslation('dashboard');
  const { error, loading, data } = useQuery(QUERY_MEASURES);
  const router = useRouter();

  function viewMeasure(measureId) {
    router.push(`/umit/measure/${measureId}`);
  }

  const columns = useColumns(
    [
      ['id', 'id', 'hidden'],
      [
        t('umit:date-measure'),
        'measureDate',
        ({
          column: {
            options: { action },
          },
          cell: { value },
          row: {
            values: { id },
          },
        }) => <Button action={action} label={formatDate(value)} value={id} block />,
        { action: viewMeasure },
      ],
      [t('umit:thickness'), 'sensor.name'],
      [
        t('umit:thickness'),
        'thickness',
        ({ cell: { value } }) => <NumberField value={value.toFixed(3)} unit="mm" />,
      ],
    ],
    false
  );

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <Dashboard
      title={t('measures', { count: data.umitMeasures.length })}
      total={t('measures-total')}
      count={data.umitMeasuresCount}
    >
      <Table columns={columns} data={data.umitMeasures} />
    </Dashboard>
  );
}
