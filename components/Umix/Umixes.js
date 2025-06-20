import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { perPage } from '../../config';
import useSocket from '../../lib/useSocket';
import ButtonNew from '../Buttons/ButtonNew';
import DisplayError from '../ErrorMessage';
import { Help, HelpButton, useHelp } from '../Help';
import Loading from '../Loading';
import Pagination from '../Pagination';
import SearchField, { ActualFilter, useFilter } from '../SearchField';
import EntetePage from '../styles/EntetePage';
import Switch from '../Tables/Switch';
import Table, { useColumns } from '../Tables/Table';
import UmixRT from '../Tables/UmixRT';
import UmixStatus from '../Tables/UmixStatus';
import { useUser } from '../User/Queries';
import {
  ACTIVATE_PLAYLIST_UMIX,
  ALL_UMIXES_QUERY,
  CHANGE_STATUS_UMIX,
  PAGINATION_QUERY,
} from './Queries';
import UmixDetails from './UmixDetails';
import UmixNew from './UmixNew';
import UmixPlayNow from './UmixPlayNow';

export default function Umixes() {
  const router = useRouter();
  const [queryPagination, { error: errorPage, loading: loadingPage, data: dataPage }] =
    useLazyQuery(PAGINATION_QUERY);
  const [queryUmixes, { error, loading, data }] = useLazyQuery(ALL_UMIXES_QUERY);
  const [updatePlaylistActive] = useMutation(ACTIVATE_PLAYLIST_UMIX, {
    refetchQueries: [
      {
        query: ALL_UMIXES_QUERY,
        variables: { skip: 0, take: perPage },
      },
    ],
  });
  const [changeStatus] = useMutation(CHANGE_STATUS_UMIX, {
    refetchQueries: [
      {
        query: ALL_UMIXES_QUERY,
        variables: { skip: 0, take: perPage },
      },
    ],
  });
  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const { t } = useTranslation('umix');
  const [showUmix, setShowUmix] = useState('');
  const [showPlayNow, setShowPlayNow] = useState('');
  const [newUmix, setNewUmix] = useState(false);
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('umix');
  const { user } = useUser();
  const { isConnected } = useSocket();

  const searchFields = [
    { field: 'name.contains', label: t('umix'), type: 'text' },
    { field: 'owner.name.contains', label: t('common:owner'), type: 'text' },
    { field: 'playlistActive.equals', label: t('active'), type: 'switch' },
  ];

  const { showFilter, setShowFilter, filters, handleNewFilter, resetFilters } =
    useFilter(updateConnectionStatus);

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      take: perPage,
    };
    if (filters) variables.where = filters;
    queryPagination({ variables });
    queryUmixes({ variables });
  }, [filters, queryPagination, queryUmixes, page]);

  function viewUmix(id) {
    if (id) setShowUmix(id);
  }

  function editUmix(id) {
    if (id) router.push(`/umix/${id}`);
  }

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [t('umix'), 'name'],
    [t('common:description'), 'description'],
    [
      t('status'),
      'status',
      ({
        cell: { value },
        row: {
          values: { id },
        },
      }) => (
        <UmixStatus
          status={value[0].status}
          modificationDate={value[0].modificationDate}
          onChangeStatus={(key) => changeStatus({ variables: { umixId: id, status: key } })}
        />
      ),
    ],
    [
      t('active'),
      'playlistActive',
      ({
        cell: { value },
        row: {
          values: { id },
        },
      }) => (
        <Switch
          value={value}
          callBack={(newValue) =>
            updatePlaylistActive({ variables: { umixId: id, value: newValue } })
          }
        />
      ),
    ],
    [t('common:owner'), 'owner.name'],
    [
      t('umix:connection-status'),
      'connected',
      ({
        row: {
          values: { id },
        },
      }) => <UmixRT umixId={id} playNow onPlay={onPlay} />,
    ],
  ]);

  function onPlay(id) {
    console.log('id', id);
    setShowPlayNow(id);
  }

  function updateConnectionStatus(umixId, connected) {
    console.log(`update status ${umixId} ${connected}`);
  }

  // console.log(`data umixes`, data);

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;

  return (
    <>
      <Head>
        <title>UCheck In - {t('umixes')}</title>
      </Head>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      {showUmix !== '' && (
        <UmixDetails open={!!showUmix} onClose={() => setShowUmix('')} id={showUmix} />
      )}
      {newUmix && <UmixNew open={!!newUmix} onClose={() => setNewUmix(false)} ownerId={user.id} />}
      {showPlayNow !== '' && (
        <UmixPlayNow
          open={!!showPlayNow}
          onClose={() => setShowPlayNow('')}
          id={showPlayNow}
          ownerId={user.id}
        />
      )}
      <EntetePage>
        <h3>{t('umixes')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
        <ButtonNew onClick={() => setNewUmix(true)} />
      </EntetePage>
      <Pagination
        page={page}
        error={errorPage}
        loading={loadingPage}
        count={count}
        pageRef="umixes"
        withFilter
        setShowFilter={setShowFilter}
      />
      <SearchField
        fields={searchFields}
        showFilter={showFilter}
        onClose={() => setShowFilter(false)}
        onFilterChange={handleNewFilter}
        isAdmin={user.role?.canManageAllUmix}
      />
      <ActualFilter fields={searchFields} actualFilter={filters} removeFilters={resetFilters} />
      <RTServerStatus status={isConnected}>
        {t('server-status', { status: isConnected ? t('connected') : t('disconnected') })}
      </RTServerStatus>
      <Table
        columns={columns}
        data={data?.umixes}
        error={error}
        loading={loading}
        actionButtons={[
          { type: 'view', action: viewUmix },
          { type: 'edit', action: editUmix },
        ]}
      />
    </>
  );
}

export const RTServerStatus = styled.div`
  background-color: ${(props) => (props.status ? 'var(--green)' : 'var(--red)')};
  color: white;
  padding: 5px 2rem;
  border-radius: 2rem;
  max-width: fit-content;
  margin-bottom: 1rem;
`;
