import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import { perPage } from '../../config';
import useConfirm from '../../lib/useConfirm';
import ButtonNew from '../Buttons/ButtonNew';
import Drawer from '../Drawer';
import DisplayError from '../ErrorMessage';
import { Help, HelpButton, useHelp } from '../Help';
import Loading from '../Loading';
import Pagination from '../Pagination';
import SearchField, { ActualFilter, useFilter } from '../SearchField';
import EntetePage from '../styles/EntetePage';
import Avatar from '../Tables/Avatar';
import Table, { useColumns } from '../Tables/Table';
import Actions from './Actions';
import { ALL_USERS_QUERY, DELETE_USER, PAGINATION_QUERY } from './Queries';
import Signup from './SignUp';

export default function Users() {
  const router = useRouter();

  const [queryPagination, { error: errorPage, loading: loadingPage, data: dataPage }] =
    useLazyQuery(PAGINATION_QUERY);
  const [queryUsers, { error, loading, data }] = useLazyQuery(ALL_USERS_QUERY);

  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const [deleteUser, { error: errorDelete }] = useMutation(DELETE_USER, {
    onCompleted: (data) => {
      console.log('data', data);
    },
  });
  const { t } = useTranslation('user');
  const [newUser, setNewUser] = useState(false);
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('user');
  const searchFields = [
    { field: 'name.contains', label: t('user'), type: 'text' },
    { field: 'email.contains', label: t('common:email'), type: 'text' },
    { field: 'company.contains', label: t('company'), type: 'text' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter, resetFilters } = useFilter();
  const { Confirm, setIsOpen, setArgs } = useConfirm({
    title: t('confirm-delete-user'),
    message: t('you-confirm-delete-user'),
    yesLabel: t('yes-delete'),
    noLabel: t('no-delete'),
    callback: (args) => deleteUser(args),
  });
  const [showActions, setShowActions] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      take: perPage,
    };
    if (filters) variables.where = filters;
    queryPagination({ variables: filters });
    queryUsers({ variables });
  }, [filters, queryPagination, queryUsers, page]);

  function userProfile(id) {
    if (id) router.push(`/user/${id}`);
  }

  function userAccount(id) {
    if (id) router.push(`/account/${id}`);
  }

  function userSettings(id) {
    if (id) router.push(`/settings/${id}`);
  }

  function userView(id) {
    setSelectedUserId(id);
    setShowActions(true);
  }

  function userDelete(id) {
    setArgs({ variables: { id } });
    setIsOpen(true);
  }

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [
      t('photo'),
      'photo.publicUrlTransformed',
      ({ cell: { value } }) => <Avatar src={value} size={50} fullWidth />,
    ],
    [t('common:name'), 'name'],
    [t('common:email'), 'email'],
    [t('role'), 'role.name'],
    [t('company'), 'company'],
  ]);

  function handleCloseNewUser() {
    setNewUser(false);
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (errorDelete) return <DisplayError error={errorDelete} />;
  return (
    <>
      <Head>
        <title>UCheck In - {t('users')}</title>
      </Head>
      <Confirm />
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <Signup open={newUser} onClose={handleCloseNewUser} />
      <Drawer open={showActions && selectedUserId} onClose={() => setShowActions(false)}>
        <Actions userId={selectedUserId} />
      </Drawer>
      <EntetePage>
        <h3>{t('users')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
        <ButtonNew
          onClick={() => {
            setNewUser(true);
          }}
        />
      </EntetePage>
      <Pagination
        page={page}
        error={errorPage}
        loading={loadingPage}
        count={count}
        pageRef="users"
        withFilter
        setShowFilter={setShowFilter}
      />
      <SearchField
        fields={searchFields}
        showFilter={showFilter}
        onClose={() => setShowFilter(false)}
        onFilterChange={handleNewFilter}
      />
      <ActualFilter fields={searchFields} actualFilter={filters} removeFilters={resetFilters} />
      <Table
        columns={columns}
        data={data?.users}
        error={error}
        loading={loading}
        actionButtons={[
          { type: 'user-profile', action: userProfile },
          { type: 'user-account', action: userAccount },
          { type: 'settings', action: userSettings },
          { type: 'view', action: userView },
          { type: 'trash', action: userDelete },
        ]}
      />
    </>
  );
}
