import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

import { useEffect, useState } from 'react';
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
import { LicenseTypes } from '../Tables/LicenseType';
import Button from '../Tables/Button';
import { PAGINATION_QUERY, ALL_APPLICATIONS_QUERY } from './Queries';
import { Help, HelpButton, useHelp } from '../Help';
import LicenseNew from '../License/LicenseNew';
import ApiKey from '../Tables/ApiKey';
import SearchField, { useFilter } from '../SearchField';
import { useUser } from '../User/Queries';

export default function Applications() {
  const router = useRouter();
  const user = useUser();
  const [
    queryPagination,
    { error: errorPage, loading: loadingPage, data: dataPage },
  ] = useLazyQuery(PAGINATION_QUERY);
  const [queryApplications, { data, error, loading }] = useLazyQuery(
    ALL_APPLICATIONS_QUERY
  );

  const page = parseInt(router.query.page) || 1;
  const { count } = dataPage?.count || 1;
  const { t } = useTranslation('application');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp(
    'application'
  );
  const [showAddLicense, setShowAddLicense] = useState(false);
  const [dataAddLicense, setDataAddLicense] = useState({});

  const searchFields = [
    { field: 'name_contains_i', label: t('common:name'), type: 'text' },
    { field: 'owner_contains_i', label: t('common:owner'), type: 'text' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter } = useFilter();

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      first: perPage,
    };
    if (filters) variables.where = filters;
    queryPagination({ variables: filters });
    queryApplications({ variables });
  }, [filters, queryPagination, queryApplications, page]);

  function editApplication(id) {
    router.push(`/application/${id}`);
  }

  function AddLicense(id) {
    const app = data.allApplications.find((a) => a.id === id);
    if (!app.licenseTypes?.length) return;
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
      'licenseTypes',
      ({ cell: { value } }) => <LicenseTypes licenses={value} />,
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

  if (loading || !data) return <Loading />;
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
        withFilter
        setShowFilter={setShowFilter}
      />
      <SearchField
        fields={searchFields}
        showFilter={showFilter}
        onClose={() => setShowFilter(false)}
        onFilterChange={handleNewFilter}
        isAdmin={user.role?.canManageApplication}
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
