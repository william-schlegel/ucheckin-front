import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/dist/client/router';
import Dashboard from '../Dashboard';
import DisplayError from '../ErrorMessage';

import Loading from '../Loading';
import Button from '../Tables/Button';
import Switch from '../Tables/Switch';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';

const nbLicenses = 5;

const QUERY_LICENSES = gql`
  query QUERY_LICENSES {
    licenses(take:${nbLicenses} , orderBy: {validity: asc}) {
      id
      validity
      valid
      application {
        id
        name
      }
      licenseType {
        id
        name
      }
      signal {
        id
        name
      }
      owner {
        id
        name
      }
    }
    licensesCount
  }
`;

export default function DashboardLicense() {
  const { t } = useTranslation('dashboard');
  const { error, loading, data } = useQuery(QUERY_LICENSES);
  const router = useRouter();

  function viewSignal(signalId) {
    router.push(`/signal/${signalId}`);
  }
  function viewApp(appId) {
    router.push(`/application/${appId}`);
  }

  const columns = useColumns(
    [
      ['appId', 'application.id', 'hidden'],
      ['signalId', 'signal.id', 'hidden'],
      [
        t('license:signal'),
        'signal.name',
        ({
          column: {
            options: { action },
          },
          cell: { value },
          row: {
            values: { 'signal.id': id },
          },
        }) =>
          id ? <Button action={action} label={value} value={id} block /> : null,
        { action: viewSignal },
      ],
      [
        t('license:application'),
        'application.name',
        ({
          column: {
            options: { action },
          },
          cell: { value },
          row: {
            values: { 'application.id': id },
          },
        }) => <Button action={action} label={value} value={id} block />,
        { action: viewApp },
      ],
      [
        t('license:valid'),
        'valid',
        ({ cell: { value } }) => (
          <Switch label={t('license:valid')} value={value} disabled />
        ),
      ],
      [
        t('license:validity'),
        'validity',
        ({ cell: { value } }) => <ValidityDate value={value} />,
      ],
    ],
    false
  );

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <Dashboard
      title={t('licenses', { count: data.licenses.length })}
      total={t('licenses-total')}
      count={data.licensesCount}
    >
      <Table columns={columns} data={data.licenses} />
    </Dashboard>
  );
}
