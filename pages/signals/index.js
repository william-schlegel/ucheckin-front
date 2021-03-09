import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

import { useState } from 'react';
import Pagination from '../../components/Pagination';
import Table, { useColumns } from '../../components/Table';
import { perPage } from '../../config';
import Loading from '../../components/Loading';
import DisplayError from '../../components/ErrorMessage';
import EntetePage from '../../components/styles/EntetePage';
import ButtonNew from '../../components/Buttons/ButtonNew';
import SignalNew from '../../components/Signal/SignalNew';
import { useUser } from '../../components/User';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    countPage: _allSignalsMeta {
      count
    }
  }
`;

export const ALL_SIGNALS_QUERY = gql`
  query ALL_SIGNALS_QUERY($skip: Int = 0, $first: Int) {
    allSignals(first: $first, skip: $skip) {
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
  const { data, error, loading } = useQuery(ALL_SIGNALS_QUERY, {
    variables: {
      skip: (page - 1) * perPage,
      first: perPage,
    },
  });
  const user = useUser();

  function editSignal(id) {
    router.push(`/signal/${id}`);
  }

  function validateSignal(id) {
    console.log('validate id', id);
  }

  const columns = useColumns(
    user
      ? [
          ['id', 'id', { ui: 'hidden' }],
          [t('signal'), 'signal', { ui: 'button', action: editSignal }],
          [t('common:owner'), 'owner.name'],
          [
            t('active'),
            'active',
            {
              ui: 'checkbox',
              action: validateSignal,
              disabled: !user.role.canManageSignal,
            },
          ],
          [t('validity'), 'validity', { ui: 'date' }],
        ]
      : []
  );

  const [newSignal, setNewSignal] = useState(false);

  function handleCloseNewSignal(id) {
    setNewSignal(false);
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <>
      <Head>
        <title>{t('signals')}</title>
      </Head>
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
      />
      <Table
        columns={columns}
        data={data.allSignals}
        error={error}
        loading={loading}
        actionButtons={[{ type: 'edit', action: editSignal }]}
      />
    </>
  );
}
