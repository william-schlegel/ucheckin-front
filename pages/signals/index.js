import { useEffect, useRef, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

import SearchField, { useSearch } from '../../components/SearchField';
import Pagination from '../../components/Pagination';
import Table, { useColumns } from '../../components/Tables/Table';
import { perPage } from '../../config';
import Loading from '../../components/Loading';
import DisplayError from '../../components/ErrorMessage';
import EntetePage from '../../components/styles/EntetePage';
import ButtonNew from '../../components/Buttons/ButtonNew';
import { useUser } from '../../components/User';
import SignalDetails from '../../components/Signal/SignalDetails';
import SignalNew from '../../components/Signal/SignalNew';
import Button from '../../components/Tables/Button';
import ValidityDate from '../../components/Tables/ValidityDate';
import Switch from '../../components/Tables/Switch';
// TODO: server side query
// import { initializeApollo, addApolloState } from '../../lib/apolloClient';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    countPage: _allSignalsMeta {
      count
    }
  }
`;

export const ALL_SIGNALS_QUERY = gql`
  query ALL_SIGNALS_QUERY(
    $skip: Int = 0
    $first: Int
    $signal: String
    $owner: String
    $active: Boolean
  ) {
    allSignals(
      first: $first
      skip: $skip
      where: {
        AND: [
          { signal_contains_i: $signal }
          { owner: { name_contains_i: $owner } }
          { active: $active }
        ]
      }
    ) {
      id
      signal
      active
      validity
      owner {
        id
        name
      }
    }
  }
`;

export default function Signals() {
  const router = useRouter();
  const { error: errorPage, loading: loadingPage, data: dataPage } = useQuery(
    PAGINATION_QUERY
  );
  const page = parseInt(router.query.page) || 1;
  const { count } = dataPage?.countPage || 1;
  const { t } = useTranslation('signal');
  const [findSignals, { error, loading, data }] = useLazyQuery(
    ALL_SIGNALS_QUERY
  );
  const user = useUser();
  const [showSignal, setShowSignal] = useState('');
  const [newSignal, setNewSignal] = useState(false);
  const searchFields = useRef([
    { field: 'signal', label: t('signal'), type: 'text' },
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
    if (filters.signal) variables.signal = filters.signal;
    if (filters.owner) variables.owner = filters.owner;
    if (filters.active) variables.active = filters.active;
    if (variables.filters) variables.skip = 0;
    console.log('variables', variables);
    findSignals({
      variables,
    });
  }, [filters, page, findSignals]);

  function editSignal(id) {
    console.log('editSignal id', id);
    if (id) setShowSignal(id);
  }

  function validateSignal(id) {
    console.log('validate id', id);
  }

  const columns = useColumns(
    user
      ? [
          ['id', 'id', 'hidden'],
          [
            t('signal'),
            'signal',
            ({
              column: {
                options: { action },
              },
              cell: { value },
            }) => <Button action={action} value={value} />,
            { action: editSignal },
          ],
          [
            t('active'),
            'active',
            ({
              column: {
                options: { disabled },
              },
              cell: { value },
            }) => <Switch value={value} disabled={disabled} />,
            { disabled: !user.role.canManageSignal, callBack: validateSignal },
          ],
          [t('common:owner'), 'owner.name'],
          [
            t('validity'),
            'validity',
            ({ cell: { value } }) => <ValidityDate value={value} />,
          ],
        ]
      : []
  );

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
      <SignalDetails
        open={!!showSignal}
        onClose={handleCloseShowSignal}
        id={showSignal}
      />
      <SignalNew open={newSignal} onClose={handleCloseNewSignal} />
      <EntetePage>
        <h3>{t('signals')}</h3>
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
        actionButtons={[{ type: 'edit', action: editSignal }]}
      />
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
