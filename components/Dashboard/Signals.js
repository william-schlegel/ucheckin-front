import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/dist/client/router';
import DisplayError from '../ErrorMessage';

import Loading from '../Loading';
import { Card } from '../styles/Card';
import Button from '../Tables/Button';
import {
  LicensesDetailsSignal,
  LicensesLegendSignal,
} from '../Tables/LicensesDetails';
import Switch from '../Tables/Switch';
import Table, { useColumns } from '../Tables/Table';

const nbSignaux = 5;

const QUERY_SIGNAUX = gql`
  query QUERY_SIGNAUX {
    allSignals(first:${nbSignaux} , sortBy: creation_DESC) {
      id
      signal
      active
      creation
      licenses {
        id
        validity
        application {
          id
          name
        }
      }
      owner {
        id
        name
      }
    }
  }
`;

export default function DashboardApplication() {
  const { t } = useTranslation('dashboard');
  const { error, loading, data } = useQuery(QUERY_SIGNAUX);
  const router = useRouter();

  function viewSignal(signalId) {
    router.push(`/signal/${signalId}`);
  }

  const columns = useColumns(
    [
      ['id', 'id', 'hidden'],
      [
        t('common:signal'),
        'signal',
        ({
          column: {
            options: { action },
          },
          cell: { value },
          row: {
            values: { id },
          },
        }) => <Button action={action} label={value} value={id} block />,
        { action: viewSignal },
      ],
      [
        t('signal:active'),
        'active',
        ({ cell: { value } }) => (
          <Switch label={t('signal:active')} value={value} disabled />
        ),
      ],
      [
        t('signal:licenses'),
        'licenses',
        ({ cell: { value } }) => <LicensesDetailsSignal licenses={value} />,
      ],
      [t('common:owner'), 'owner.name', 'hidden'],
    ],
    false
  );

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <Card>
      <h2>{t('signals', { count: nbSignaux })}</h2>
      <Table columns={columns} data={data.allSignals} />
      <LicensesLegendSignal />
    </Card>
  );
}
