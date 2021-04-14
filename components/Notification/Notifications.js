import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { Confirm } from 'notiflix';

import Pagination from '../Pagination';
import Table, { useColumns } from '../Tables/Table';
import { perPage } from '../../config';
import Loading from '../Loading';
import DisplayError from '../ErrorMessage';
import EntetePage from '../styles/EntetePage';
import NotificationDetails from './NotificationDetails';
import ValidityDate from '../Tables/ValidityDate';
import {
  PAGINATION_QUERY,
  ALL_NOTIFICATIONS_QUERY,
  DELETE_NOTIFICATION_MUTATION,
} from './Queries';
import { useHelp, Help, HelpButton } from '../Help';
import SearchField, { useFilter } from '../SearchField';
import { useUser } from '../User/Queries';
import NotificationType from '../Tables/NotificationType';
import ButtonNew from '../Buttons/ButtonNew';

export default function Notifications() {
  const router = useRouter();
  const { user } = useUser();

  const [
    queryPagination,
    { error: errorPage, loading: loadingPage, data: dataPage },
  ] = useLazyQuery(PAGINATION_QUERY);
  const [queryNotifications, { error, loading, data }] = useLazyQuery(
    ALL_NOTIFICATIONS_QUERY
  );
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION_MUTATION);
  const page = parseInt(router.query.page) || 1;
  const { count } = dataPage?.count || 1;
  const { t } = useTranslation('notification');
  const [showNotification, setShowNotification] = useState('');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp(
    'notification'
  );

  const searchFields = [
    { field: 'name_contains_i', label: t('name'), type: 'text' },
    { field: 'displayName_contains_i', label: t('display-name'), type: 'text' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter } = useFilter();

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      first: perPage,
    };
    if (filters) variables.where = filters;
    queryPagination({ variables: filters });
    queryNotifications({ variables });
  }, [filters, queryPagination, queryNotifications, page]);

  function viewNotification(id) {
    if (id) setShowNotification(id);
  }

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [t('name'), 'name'],
    [t('display-name'), 'displayName'],
    [
      t('type'),
      'type',
      ({ cell: { value } }) => <NotificationType notification={value} />,
    ],
    [
      t('start-date'),
      'startDate',
      ({ cell: { value } }) => <ValidityDate value={value} noColor />,
    ],
    [
      t('end-date'),
      'endDate',
      ({ cell: { value } }) => <ValidityDate value={value} noColor />,
    ],
  ]);

  function handleCloseShowNotification() {
    setShowNotification('');
  }

  function handleDeleteNotification(id) {
    Confirm.Show(
      t('confirm-delete'),
      t('you-confirm'),
      t('yes-delete'),
      t('no-delete'),
      () =>
        deleteNotification({
          update: (cache, payload) =>
            cache.evict(cache.identify(payload.data.deleteNotification)),
          variables: { id },
        })
    );
  }

  const actionButtons = [
    { type: 'view', action: viewNotification },
    { type: 'edit', action: (id) => router.push(`/notification/${id}`) },
    { type: 'trash', action: (id) => handleDeleteNotification(id) },
  ];

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <>
      <Head>
        <title>{t('notifications')}</title>
      </Head>
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
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
        <ButtonNew onClick={() => router.push('/notification')} />
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
      <Table
        columns={columns}
        data={data?.allNotifications}
        error={error}
        loading={loading}
        actionButtons={actionButtons}
      />
    </>
  );
}
