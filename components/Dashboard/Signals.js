import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import useTranslation from 'next-translate/useTranslation';

import Dashboard from '../Dashboard';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import Button from '../Tables/Button';
import {
  LicensesApplications,
  LicensesDetailsSignal,
  LicensesLegendSignal,
} from '../Tables/LicensesDetails';
import Switch from '../Tables/Switch';
import Table, { useColumns } from '../Tables/Table';

const nbSignals = 5;

const QUERY_SIGNALS = gql`
  query QUERY_SIGNALS {
    signals(take:${nbSignals} , orderBy: {creation: desc}) {
      id
      name
      active
      creation
      licenses {
        id
        validity
      }
      applications: licenses {

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
    signalsCount
  }
`;

export default function DashboardSignal() {
  const { t } = useTranslation('dashboard');
  const { error, loading, data } = useQuery(QUERY_SIGNALS);
  const router = useRouter();

  function viewSignal(signalId) {
    router.push(`/signal/${signalId}`);
  }

  const columns = useColumns(
    [
      ['id', 'id', 'hidden'],
      [
        t('common:signal'),
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
        { action: viewSignal },
      ],
      [
        t('signal:active'),
        'active',
        ({ cell: { value } }) => <Switch label={t('signal:active')} value={value} disabled />,
      ],
      [
        t('application:applications'),
        'applications',
        ({ cell: { value } }) => <LicensesApplications licenses={value} />,
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
    <Dashboard
      title={t('signals', { count: data.signals.length })}
      total={t('signals-total')}
      count={data.signalsCount}
    >
      <Table columns={columns} data={data.signals} />
      <LicensesLegendSignal />
    </Dashboard>
  );
}
