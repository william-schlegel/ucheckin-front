import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import { perPage } from '../../config';
import DisplayError from '../ErrorMessage';
import { Help, HelpButton, useHelp } from '../Help';
import Loading from '../Loading';
import Pagination from '../Pagination';
import SearchField, { ActualFilter, useFilter } from '../SearchField';
import EntetePage from '../styles/EntetePage';
import Button from '../Tables/Button';
import {
  LicensesApplications,
  LicensesDetailsSignal,
  LicensesLegendSignal,
} from '../Tables/LicensesDetails';
import Switch from '../Tables/Switch';
import Table, { useColumns } from '../Tables/Table';
import { useUser } from '../User/Queries';
import { ALL_SIGNALS_QUERY, PAGINATION_QUERY, VALIDATE_SIGNAL_MUTATION } from './Queries';
import SignalDetails from './SignalDetails';

export default function Signals() {
  const router = useRouter();
  const [queryPagination, { error: errorPage, loading: loadingPage, data: dataPage }] =
    useLazyQuery(PAGINATION_QUERY);
  const [querySignals, { error, loading, data }] = useLazyQuery(ALL_SIGNALS_QUERY);
  const [updateValidity] = useMutation(VALIDATE_SIGNAL_MUTATION);

  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const { t } = useTranslation('signal');
  const [showSignal, setShowSignal] = useState('');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('signal');
  const { user } = useUser();

  const searchFields = [
    { field: 'name.contains', label: t('signal'), type: 'text' },
    { field: 'owner.name.contains', label: t('common:owner'), type: 'text' },
    { field: 'active.equals', label: t('active'), type: 'switch' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter, resetFilters } = useFilter();

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      take: perPage,
    };
    if (filters) variables.where = filters;
    queryPagination({ variables: filters });
    querySignals({ variables });
  }, [filters, queryPagination, querySignals, page]);

  function viewSignal(id) {
    if (id) setShowSignal(id);
  }

  function editSignal(id) {
    if (id) router.push(`/signal/${id}`);
  }

  function validateSignal(id, value) {
    updateValidity({ variables: { id, value: !value } });
  }

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [
      t('signal'),
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
      { action: editSignal },
    ],
    [
      t('active'),
      'active',
      ({
        cell: { value },
        row: {
          values: { id },
        },
      }) => <Switch value={value} disabled={false} callBack={() => validateSignal(id, value)} />,
    ],
    [t('common:owner'), 'owner.name'],
    [
      t('applications'),
      'applications',
      ({ cell: { value } }) => <LicensesApplications licenses={value} />,
      {},
      'licenses_app',
    ],
    [
      t('licenses'),
      'licenses',
      ({ cell: { value } }) => <LicensesDetailsSignal licenses={value} />,
    ],
    [
      t('notification'),
      'notification',
      ({ cell: { value } }) =>
        value ? (
          <span>
            {value.name} ({value.displayName})
          </span>
        ) : null,
    ],
  ]);

  function handleCloseShowSignal() {
    setShowSignal('');
  }
  console.log(`data signals`, data);

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <>
      <Head>
        <title>{t('signals')}</title>
      </Head>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      {showSignal && (
        <SignalDetails open={!!showSignal} onClose={handleCloseShowSignal} id={showSignal} />
      )}
      <EntetePage>
        <h3>{t('signals')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
      </EntetePage>
      <Pagination
        page={page}
        error={errorPage}
        loading={loadingPage}
        count={count}
        pageRef="signals"
        withFilter
        setShowFilter={setShowFilter}
      />
      <SearchField
        fields={searchFields}
        showFilter={showFilter}
        onClose={() => setShowFilter(false)}
        onFilterChange={handleNewFilter}
        isAdmin={user.role?.canManageSignal}
      />
      <ActualFilter fields={searchFields} actualFilter={filters} removeFilters={resetFilters} />
      <Table
        columns={columns}
        data={data?.signals}
        error={error}
        loading={loading}
        actionButtons={[{ type: 'view', action: viewSignal }]}
      />
      <LicensesLegendSignal />
    </>
  );
}
