import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import { perPage } from '../../config';
import useAction from '../../lib/useAction';
import useConfirm from '../../lib/useConfirm';
import ButtonNew from '../Buttons/ButtonNew';
import DisplayError from '../ErrorMessage';
import { Help, HelpButton, useHelp } from '../Help';
import Loading from '../Loading';
import Pagination from '../Pagination';
import SearchField, { ActualFilter, useFilter } from '../SearchField';
import EntetePage from '../styles/EntetePage';
import NotificationType from '../Tables/NotificationType';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';
import { useUser } from '../User/Queries';
import NotificationDetails from './NotificationDetails';
import NotificationNew from './NotificationNew';
import { ALL_NOTIFICATIONS_QUERY, DELETE_NOTIFICATION_MUTATION, PAGINATION_QUERY } from './Queries';

export default function Notifications() {
  const router = useRouter();
  const { setAction } = useAction();
  const [queryPagination, { error: errorPage, loading: loadingPage, data: dataPage }] =
    useLazyQuery(PAGINATION_QUERY);
  const [queryNotifications, { error, loading, data }] = useLazyQuery(ALL_NOTIFICATIONS_QUERY);
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION_MUTATION, {
    onCompleted: (data) =>
      setAction(
        `delete notification ${data.deleteNotification.id} (${data.deleteNotification.name})`
      ),
  });
  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const { t } = useTranslation('notification');
  const [showNotification, setShowNotification] = useState('');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('notification');
  const { user } = useUser();

  const searchFields = [
    { field: 'name.contains', label: t('name'), type: 'text' },
    { field: 'displayName.contains', label: t('display-name'), type: 'text' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter } = useFilter();
  const [newNotification, setNewNotification] = useState(false);
  const { Confirm, setIsOpen, setArgs } = useConfirm({
    title: t('confirm-delete'),
    message: t('you-confirm'),
    yesLabel: t('yes-delete'),
    noLabel: t('no-delete'),
    callback: (args) => deleteNotification(args),
  });

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      take: perPage,
    };
    if (filters) variables.where = filters;
    queryPagination({ variables: filters });
    queryNotifications({ variables });
  }, [filters, queryPagination, queryNotifications, page]);

  function viewNotification(id) {
    if (id) setShowNotification(id);
  }

  function handleCloseNewNotification() {
    setNewNotification(false);
  }

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [t('name'), 'name'],
    [t('display-name'), 'displayName'],
    [t('type'), 'type', ({ cell: { value } }) => <NotificationType notification={value} />],
    [t('application'), 'application.name'],
    [t('signal'), 'signal.name'],
    [t('start-date'), 'startDate', ({ cell: { value } }) => <ValidityDate value={value} noColor />],
    [t('end-date'), 'endDate', ({ cell: { value } }) => <ValidityDate value={value} noColor />],
  ]);

  function handleCloseShowNotification() {
    setShowNotification('');
  }

  function handleDeleteNotification(id) {
    setIsOpen(true);
    setArgs({
      update: (cache, payload) => cache.evict(cache.identify(payload.data.deleteNotification)),
      variables: { id },
    });
  }

  const actionButtons = [
    { type: 'view', action: viewNotification },
    {
      type: 'edit',
      action: (id) => {
        router.push(`/notification/${id}`);
      },
    },
    { type: 'trash', action: (id) => handleDeleteNotification(id) },
  ];

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;

  return (
    <>
      <Head>
        <title>{t('notifications')}</title>
      </Head>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <Confirm />
      {newNotification && (
        <NotificationNew open={newNotification} onClose={handleCloseNewNotification} />
      )}
      {showNotification && (
        <NotificationDetails
          open={!!showNotification}
          onClose={handleCloseShowNotification}
          id={showNotification}
        />
      )}
      <EntetePage>
        <h3>{t('notifications')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
        <ButtonNew
          onClick={() => {
            setNewNotification(true);
          }}
        />
      </EntetePage>
      <Pagination
        page={page}
        error={errorPage}
        loading={loadingPage}
        count={count}
        pageRef="notifications"
        withFilter
        setShowFilter={setShowFilter}
      />
      <SearchField
        fields={searchFields}
        showFilter={showFilter}
        onClose={() => setShowFilter(false)}
        onFilterChange={handleNewFilter}
        isAdmin={user.role?.canManageNotification}
      />
      <ActualFilter fields={searchFields} actualFilter={filters} />
      <Table
        columns={columns}
        data={data?.notifications}
        error={error}
        loading={loading}
        actionButtons={actionButtons}
      />
    </>
  );
}
