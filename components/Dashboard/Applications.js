import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';
import DisplayError from '../ErrorMessage';

import Loading from '../Loading';
import { Card } from '../styles/Card';
import Button from '../Tables/Button';
import {
  LicensesDetailsApplication,
  LicensesLegendApplication,
} from '../Tables/LicensesDetails';
import LicenseType from '../Tables/LicenseType';
import Table, { useColumns } from '../Tables/Table';
import { useUser } from '../User';

const nbApp = 5;

const QUERY_APPLICATIONS = gql`
  query QUERY_APPLICATIONS {
    allApplications(first:${nbApp} , sortBy: creation_DESC) {
      id
      name
      licenseType
      validity
      creation
      licenses {
        id
        validity
        signal {
          id
          signal
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
  const { error, loading, data } = useQuery(QUERY_APPLICATIONS);
  const user = useUser();
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
        t('application:license-model'),
        'licenseType',
        ({ cell: { value } }) => <LicenseType license={value} />,
      ],
      [
        t('application:licenses'),
        'licenses',
        ({ cell: { value } }) => (
          <LicensesDetailsApplication licenses={value} />
        ),
      ],
      [t('common:owner'), 'owner.name', 'hidden'],
    ],
    false
  );

  useEffect(() => {
    if (user) {
      if (user.role.canManageApplication) columns[4].options = '';
    }
  }, [user, columns]);

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <Card>
      <h2>{t('applications', { count: nbApp })}</h2>
      <Table columns={columns} data={data.allApplications} />
      <LicensesLegendApplication />
    </Card>
  );
}
