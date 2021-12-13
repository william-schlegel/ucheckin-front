import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import { perPage } from '../../config';
import ButtonNew from '../Buttons/ButtonNew';
import DisplayError from '../ErrorMessage';
import { Help, HelpButton, useHelp } from '../Help';
import LicenseNew from '../License/LicenseNew';
import Loading from '../Loading';
import Pagination from '../Pagination';
import SearchField, { ActualFilter, useFilter } from '../SearchField';
import EntetePage from '../styles/EntetePage';
import ApiKey from '../Tables/ApiKey';
import Button from '../Tables/Button';
import { LicensesDetailsApplication, LicensesLegendApplication } from '../Tables/LicensesDetails';
import { LicenseTypes } from '../Tables/LicenseType';
import Table, { useColumns } from '../Tables/Table';
import { useUser } from '../User/Queries';
import ApplicationNew from './ApplicationNew';
import { ALL_APPLICATIONS_QUERY, PAGINATION_QUERY } from './Queries';

export default function Applications() {
  const router = useRouter();
  const { user } = useUser();
  const [queryPagination, { error: errorPage, loading: loadingPage, data: dataPage }] =
    useLazyQuery(PAGINATION_QUERY);
  const [queryApplications, { data, error, loading }] = useLazyQuery(ALL_APPLICATIONS_QUERY);

  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const { t } = useTranslation('application');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('application');
  const [showAddLicense, setShowAddLicense] = useState(false);
  const [dataAddLicense, setDataAddLicense] = useState({});

  const searchFields = [
    { field: 'name.contains', label: t('common:name'), type: 'text' },
    { field: 'owner.name.contains', label: t('common:owner'), type: 'text' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter, resetFilters } = useFilter();

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      take: perPage,
    };
    if (filters) variables.where = filters;
    queryPagination({ variables: filters });
    queryApplications({ variables });
  }, [filters, queryPagination, queryApplications, page]);

  function editApplication(id) {
    router.push(`/application/${id}`);
  }

  function AddLicense(id) {
    const app = data.applications.find((a) => a.id === id);
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
    [t('api-key'), 'apiKey', ({ cell: { value } }) => <ApiKey apiKey={value} />],
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
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
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
      <ActualFilter fields={searchFields} actualFilter={filters} removeFilters={resetFilters} />
      <Table
        columns={columns}
        data={data.applications}
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
