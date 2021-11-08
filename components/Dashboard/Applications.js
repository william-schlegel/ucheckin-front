import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import useTranslation from 'next-translate/useTranslation';
import { useEffect } from 'react';

import Dashboard from '../Dashboard';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import Button from '../Tables/Button';
import { LicensesDetailsApplication, LicensesLegendApplication } from '../Tables/LicensesDetails';
import { LicenseTypes } from '../Tables/LicenseType';
import Table, { useColumns } from '../Tables/Table';
import { useUser } from '../User/Queries';

const nbApp = 5;

const QUERY_APPLICATIONS = gql`
  query QUERY_APPLICATIONS {
    applications(take:${nbApp} , orderBy: {creation: desc}) {
      id
      name
      licenseTypes {
        id
      }
      creation
      licenses {
        id
        validity
        signal {
          id
          name
        }
      }
      owner {
        id
        name
      }
    }
    applicationsCount
  }
`;

export default function DashboardApplication() {
  const { t } = useTranslation('dashboard');
  const { error, loading, data } = useQuery(QUERY_APPLICATIONS);
  const { user } = useUser();
  const router = useRouter();

  function viewApp(appId) {
    router.push(`/application/${appId}`);
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
        { action: viewApp },
      ],
      [
        t('common:license-model'),
        'licenseTypes',
        ({ cell: { value } }) => <LicenseTypes licenses={value} />,
      ],
      [
        t('license:licenses'),
        'licenses',
        ({ cell: { value } }) => <LicensesDetailsApplication licenses={value} />,
      ],
      [t('common:owner'), 'owner.name', 'hidden'],
    ],
    false
  );

  useEffect(() => {
    if (user) {
      if (user.role?.canManageApplication) columns[4].options = '';
    }
  }, [user, columns]);

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <Dashboard
      title={t('applications', { count: data.applications.length })}
      total={t('applications-total')}
      count={data.applicationsCount}
    >
      <Table columns={columns} data={data.applications} />
      <LicensesLegendApplication />
    </Dashboard>
  );
}
