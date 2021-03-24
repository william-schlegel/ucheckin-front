import { useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

import { useState } from 'react';
import Pagination from '../Pagination';
import Table, { useColumns } from '../Tables/Table';
import { perPage } from '../../config';
import Loading from '../Loading';
import DisplayError from '../ErrorMessage';
import EntetePage from '../styles/EntetePage';
import ButtonNew from '../Buttons/ButtonNew';
import ApplicationNew from './ApplicationNew';
import {
  LicensesDetailsApplication,
  LicensesLegendApplication,
} from '../Tables/LicensesDetails';
import Badges from '../Tables/Badges';
import LicenseType from '../Tables/LicenseType';
import Button from '../Tables/Button';
import { PAGINATION_QUERY, ALL_APPLICATIONS_QUERY } from './Queries';
import { Help, HelpButton, useHelp } from '../Help';
import LicenseNew from './LicenseNew';
import ApiKey from '../Tables/ApiKey';

export default function Applications() {
  const router = useRouter();
  const { error: errorPage, loading: loadingPage, data: dataPage } = useQuery(
    PAGINATION_QUERY
  );
  const page = parseInt(router.query.page) || 1;
  const { count } = dataPage?.count || 1;
  const { t } = useTranslation('application');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp(
    'application'
  );
  const { data, error, loading } = useQuery(ALL_APPLICATIONS_QUERY, {
    variables: {
      skip: (page - 1) * perPage,
      first: perPage,
    },
  });
  const [showAddLicense, setShowAddLicense] = useState(false);
  const [dataAddLicense, setDataAddLicense] = useState({});

  function editApplication(id) {
    router.push(`/application/${id}`);
  }

  function AddLicense(id) {
    const app = data.allApplications.find((a) => a.id === id);
    if (!app.licenseType) return;
    setDataAddLicense({ appId: app.id, ownerId: app.owner.id });
    setShowAddLicense(true);
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
    [
      t('api-key'),
      'apiKey',
      ({ cell: { value } }) => <ApiKey apiKey={value} />,
    ],
    [
      t('common:license-model'),
      'licenseType.id',
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
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
      <ApplicationNew open={newApp} onClose={handleCloseNewApp} />
      {dataAddLicense.appId && dataAddLicense.ownerId && (
        <LicenseNew
          open={showAddLicense}
          onClose={() => setShowAddLicense(false)}
          appId={dataAddLicense.appId}
          ownerId={dataAddLicense.ownerId}
        />
      )}
      <EntetePage>
        <h3>{t('applications')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
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
        actionButtons={[
          { type: 'edit', action: editApplication },
          { type: 'add-license', action: AddLicense },
        ]}
      />
      <LicensesLegendApplication />
    </>
  );
}
