import { useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

import { useState } from 'react';
import Pagination from '../../components/Pagination';
import Table, { useColumns } from '../../components/Tables/Table';
import { perPage } from '../../config';
import Loading from '../../components/Loading';
import DisplayError from '../../components/ErrorMessage';
import EntetePage from '../../components/styles/EntetePage';
import ButtonNew from '../../components/Buttons/ButtonNew';
import ApplicationNew from '../../components/Application/ApplicationNew';
import {
  LicensesDetailsApplication,
  LicensesLegendApplication,
} from '../../components/Tables/LicensesDetails';
import Badges from '../../components/Tables/Badges';
import LicenseType from '../../components/Tables/LicenseType';
import Button from '../../components/Tables/Button';
import {
  PAGINATION_QUERY,
  ALL_APPLICATIONS_QUERY,
} from '../../components/Application/Queries';

export default function Applications() {
  const router = useRouter();
  const { error: errorPage, loading: loadingPage, data: dataPage } = useQuery(
    PAGINATION_QUERY
  );
  const page = parseInt(router.query.page) || 1;
  const { count } = dataPage?.count || 1;
  const { t } = useTranslation('application');
  const { data, error, loading } = useQuery(ALL_APPLICATIONS_QUERY, {
    variables: {
      skip: (page - 1) * perPage,
      first: perPage,
    },
  });

  function editApplication(id) {
    router.push(`/application/${id}`);
  }

  const columns = useColumns([
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
      }) => <Button action={action} label={value} value={id} />,
      { action: editApplication },
    ],
    [t('api-key'), 'apiKey'],
    [
      t('license-model'),
      'licenseType',
      ({ cell: { value } }) => <LicenseType license={value} />,
    ],
    [
      t('licenses'),
      'licenses',
      ({ cell: { value } }) => <LicensesDetailsApplication licenses={value} />,
    ],
    [t('common:owner'), 'owner.name'],
    [
      t('common:users'),
      'users',
      ({ cell: { value } }) => <Badges labels={value} />,
    ],
  ]);
  const [newApp, setNewApp] = useState(false);

  function handleCloseNewApp() {
    setNewApp(false);
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <>
      <Head>
        <title>{t('applications')}</title>
      </Head>
      <ApplicationNew open={newApp} onClose={handleCloseNewApp} />
      <EntetePage>
        <h3>{t('applications')}</h3>
        <ButtonNew
          onClick={() => {
            setNewApp(true);
          }}
        />
      </EntetePage>
      <Pagination
        page={page}
        error={errorPage}
        loading={loadingPage}
        count={count}
        pageRef="applications"
      />
      <Table
        columns={columns}
        data={data.allApplications}
        error={error}
        loading={loading}
        actionButtons={[{ type: 'edit', action: editApplication }]}
      />
      <LicensesLegendApplication />
    </>
  );
}
