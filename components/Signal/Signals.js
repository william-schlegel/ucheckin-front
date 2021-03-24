import { useEffect, useRef, useState } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

import SearchField, { useSearch } from '../SearchField';
import Pagination from '../Pagination';
import Table, { useColumns } from '../Tables/Table';
import { perPage } from '../../config';
import Loading from '../Loading';
import DisplayError from '../ErrorMessage';
import EntetePage from '../styles/EntetePage';
import ButtonNew from '../Buttons/ButtonNew';
import SignalDetails from './SignalDetails';
import SignalNew from './SignalNew';
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
// TODO: server side query
// import { initializeApollo, addApolloState } from '../../lib/apolloClient';

export default function Signals() {
  const router = useRouter();
  const { error: errorPage, loading: loadingPage, data: dataPage } = useQuery(
    PAGINATION_QUERY
  );
  // const [
  //   updateValidity,
  //   { error: errorUpdate, loading: lodingUpdate, data: dataUpdate },
  // ] = useMutation(VALIDATE_SIGNAL_MUTATION, {
  //   refetchQueries: [ALL_SIGNALS_QUERY],
  // });

  const [updateValidity] = useMutation(VALIDATE_SIGNAL_MUTATION);

  const page = parseInt(router.query.page) || 1;
  const { count } = dataPage?.count || 1;
  const { t } = useTranslation('signal');
  const [findSignals, { error, loading, data }] = useLazyQuery(
    ALL_SIGNALS_QUERY
  );
  const [showSignal, setShowSignal] = useState('');
  const [newSignal, setNewSignal] = useState(false);
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('signal');
  const searchFields = useRef([
    { field: 'name', label: t('signal'), type: 'text' },
    { field: 'owner', label: t('common:owner'), type: 'text' },
    { field: 'active', label: t('active'), type: 'switch' },
  ]);
  const {
    filters,
    setFilters,
    handleChange,
    showFilter,
    setShowFilter,
    resetFilters,
  } = useSearch(searchFields.current);

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      first: perPage,
    };
    if (filters.name) variables.name = filters.name;
    if (filters.owner) variables.owner = filters.owner;
    if (filters.active) variables.active = filters.active;
    if (variables.filters) variables.skip = 0;
    findSignals({
      variables,
    });
  }, [filters, page, findSignals]);

  function viewSignal(id) {
    if (id) setShowSignal(id);
  }

  function editSignal(id) {
    if (id) router.push(`/signal/${id}`);
  }

  function validateSignal(id, value) {
    console.log('validate id', id, value);
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
  ]);

  function handleCloseShowSignal() {
    setShowSignal('');
  }
  function handleCloseNewSignal() {
    setNewSignal(false);
  }

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
      <SignalNew open={newSignal} onClose={handleCloseNewSignal} />
      <EntetePage>
        <h3>{t('signals')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
        <ButtonNew
          onClick={() => {
            setNewSignal(true);
          }}
        />
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
        fields={searchFields.current}
        setShowFilter={setShowFilter}
        showFilter={showFilter}
        filters={filters}
        setFilters={setFilters}
        handleChange={handleChange}
        query={ALL_SIGNALS_QUERY}
        loading={loading}
        resetFilters={resetFilters}
      />
      <Table
        columns={columns}
        data={data?.allSignals}
        error={error}
        loading={loading}
        actionButtons={[{ type: 'view', action: viewSignal }]}
      />
      <LicensesLegendSignal />
    </>
  );
}

// export async function getServerSideProps(context) {
//   console.log('context', context);
//   const apolloClient = initializeApollo();

//   await apolloClient.query({
//     query: ALL_SIGNALS_QUERY,
//     variables: {
//       skip: 0,
//       first: perPage,
//     },
//   });

//   return addApolloState(apolloClient, {
//     props: {},
//   });

// const { error, loading, data } = useQuery(ALL_SIGNALS_QUERY, {
//   variables: {
//     skip: 0,
//     first: perPage,
//   },
// });

// return { props: { error, loading, data } };
// }
