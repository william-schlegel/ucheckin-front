import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import useTranslation from 'next-translate/useTranslation';

import Dashboard from '../Dashboard';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import Button from '../Tables/Button';
import Table, { useColumns } from '../Tables/Table';
import UmixStatus from '../Tables/UmixStatus';

const nbUmix = 5;

const QUERY_UMIXES = gql`
  query QUERY_UMIXES {
    umixes(take:${nbUmix} , orderBy: {modificationDate: desc}) {
      id
      name
      description
      status(orderBy: { modificationDate: desc }, take: 1) {
        status
        modificationDate
      }
    }
    umixesCount
  }
`;

export default function DashboardUmix() {
  const { t } = useTranslation('dashboard');
  const { error, loading, data } = useQuery(QUERY_UMIXES);
  const router = useRouter();

  function viewUmix(umixId) {
    router.push(`/umix/${umixId}`);
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
        { action: viewUmix },
      ],
      [t('common:description'), 'description'],
      [
        t('umix:status'),
        'status',
        ({ cell: { value } }) => <UmixStatus status={value[0].status} noChange />,
      ],
    ],
    false
  );

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <Dashboard
      title={t('umix:umixes', { count: data.umixes.length })}
      total={t('umixes-total')}
      count={data.umixesCount}
    >
      <Table columns={columns} data={data.umixes} />
    </Dashboard>
  );
}
