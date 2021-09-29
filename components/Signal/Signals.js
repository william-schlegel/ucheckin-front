import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

import Pagination from '../Pagination';
import Table, { useColumns } from '../Tables/Table';
import { perPage } from '../../config';
import Loading from '../Loading';
import DisplayError from '../ErrorMessage';
import EntetePage from '../styles/EntetePage';
import SignalDetails from './SignalDetails';
import Button from '../Tables/Button';
import Switch from '../Tables/Switch';
import {
  PAGINATION_QUERY,
  ALL_SIGNALS_QUERY,
  VALIDATE_SIGNAL_MUTATION,
} from './Queries';
import {
  LicensesDetailsSignal,
  LicensesLegendSignal,
} from '../Tables/LicensesDetails';
import { useHelp, Help, HelpButton } from '../Help';
import SearchField, { useFilter } from '../SearchField';
import { useUser } from '../User/Queries';

export default function Signals() {
  const router = useRouter();
  const [
    queryPagination,
    { error: errorPage, loading: loadingPage, data: dataPage },
  ] = useLazyQuery(PAGINATION_QUERY);
  const [querySignals, { error, loading, data }] = useLazyQuery(
    ALL_SIGNALS_QUERY
  );
  const [updateValidity] = useMutation(VALIDATE_SIGNAL_MUTATION);

  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const { t } = useTranslation('signal');
  const [showSignal, setShowSignal] = useState('');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('signal');
  const { user } = useUser();

  const searchFields = [
    { field: 'name_contains_i', label: t('signal'), type: 'text' },
    { field: 'owner.name_contains_i', label: t('common:owner'), type: 'text' },
    { field: 'active', label: t('active'), type: 'switch' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter } = useFilter();

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
      }) => (
        <Switch
          value={value}
          disabled={false}
          callBack={() => validateSignal(id, value)}
        />
      ),
    ],
    [t('common:owner'), 'owner.name'],
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
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
      {showSignal && (
        <SignalDetails
          open={!!showSignal}
          onClose={handleCloseShowSignal}
          id={showSignal}
        />
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
