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
import EventDetails from './EventDetails';
import ValidityDate from '../Tables/ValidityDate';
import {
  PAGINATION_QUERY,
  ALL_EVENTS_QUERY,
  DELETE_EVENT_MUTATION,
} from './Queries';
import { useHelp, Help, HelpButton } from '../Help';
import SearchField, { useFilter } from '../SearchField';
import { useUser } from '../User/Queries';
import ButtonNew from '../Buttons/ButtonNew';
import EventNew from './EventNew';
import Image from '../Tables/Image';
import useConfirm from '../../lib/useConfirm';

export default function Events() {
  const router = useRouter();
  const { user } = useUser();

  const [
    queryPagination,
    { error: errorPage, loading: loadingPage, data: dataPage },
  ] = useLazyQuery(PAGINATION_QUERY);
  const [queryEvents, { error, loading, data }] = useLazyQuery(
    ALL_EVENTS_QUERY
  );
  const [deleteEvent] = useMutation(DELETE_EVENT_MUTATION);
  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const { t } = useTranslation('event');
  const [showEvent, setShowEvent] = useState('');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('event');

  const searchFields = [
    { field: 'name_contains_i', label: t('name'), type: 'text' },
    { field: 'description_contains_i', label: t('description'), type: 'text' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter } = useFilter();
  const [newEvent, setNewEvent] = useState(false);

  function handleCloseNewEvent() {
    setNewEvent(false);
  }

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      take: perPage,
    };
    if (filters) variables.where = filters;
    queryPagination({ variables: filters });
    queryEvents({ variables });
  }, [filters, queryPagination, queryEvents, page]);

  function viewEvent(id) {
    if (id) setShowEvent(id);
  }

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [t('name'), 'name'],
    [t('description'), 'description'],
    [
      t('icon'),
      'imageHome',
      ({ cell: { value } }) => <Image image={value} size={40} rounded />,
    ],
    [
      t('validity-start'),
      'validityStart',
      ({ cell: { value } }) => <ValidityDate value={value} after />,
    ],
    [
      t('validity-end'),
      'validityEnd',
      ({ cell: { value } }) => <ValidityDate value={value} />,
    ],
    [
      t('publish-start'),
      'publishStart',
      ({ cell: { value } }) => <ValidityDate value={value} after />,
    ],
    [
      t('publish-end'),
      'publishEnd',
      ({ cell: { value } }) => <ValidityDate value={value} />,
    ],
  ]);

  const { Confirm, setIsOpen, setArgs } = useConfirm({
    title: t('confirm-delete'),
    message: t('you-confirm'),
    yesLabel: t('yes-delete'),
    noLabel: t('no-delete'),
    callback: (args) => deleteEvent(args),
  });

  function handleCloseShowEvent() {
    setShowEvent('');
  }

  function handleDeleteEvent(id) {
    setArgs({
      update: (cache, payload) =>
        cache.evict(cache.identify(payload.data.deleteEvent)),
      variables: { id },
    });
    setIsOpen(true);
  }

  const actionButtons = [
    { type: 'view', action: viewEvent },
    { type: 'edit', action: (id) => router.push(`/event/${id}`) },
    { type: 'trash', action: (id) => handleDeleteEvent(id) },
  ];

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <>
      <Head>
        <title>{t('events')}</title>
      </Head>
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
      <Confirm />
      <EventNew open={newEvent} onClose={handleCloseNewEvent} />
      {showEvent && (
        <EventDetails
          open={!!showEvent}
          onClose={handleCloseShowEvent}
          id={showEvent}
        />
      )}
      <EntetePage>
        <h3>{t('events')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
        <ButtonNew
          onClick={() => {
            setNewEvent(true);
          }}
        />
      </EntetePage>
      <Pagination
        page={page}
        error={errorPage}
        loading={loadingPage}
        count={count}
        pageRef="events"
        withFilter
        setShowFilter={setShowFilter}
      />
      <SearchField
        fields={searchFields}
        showFilter={showFilter}
        onClose={() => setShowFilter(false)}
        onFilterChange={handleNewFilter}
        isAdmin={user.role?.canManageEvent}
      />
      <Table
        columns={columns}
        data={data?.events}
        error={error}
        loading={loading}
        actionButtons={actionButtons}
      />
    </>
  );
}
