import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import { perPage } from '../../config';
import ButtonNew from '../Buttons/ButtonNew';
import DisplayError from '../ErrorMessage';
import { Help, HelpButton, useHelp } from '../Help';
import Loading from '../Loading';
import Pagination from '../Pagination';
import SearchField, { ActualFilter, useFilter } from '../SearchField';
import EntetePage from '../styles/EntetePage';
import Avatar from '../Tables/Avatar';
import Table, { useColumns } from '../Tables/Table';
import { ALL_USERS_QUERY, PAGINATION_QUERY } from './Queries';
import Signup from './SignUp';

export default function Users() {
  const router = useRouter();

  const [queryPagination, { error: errorPage, loading: loadingPage, data: dataPage }] =
    useLazyQuery(PAGINATION_QUERY);
  const [queryUsers, { error, loading, data }] = useLazyQuery(ALL_USERS_QUERY);

  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const { t } = useTranslation('user');
  const [newUser, setNewUser] = useState(false);
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('user');
  const searchFields = [
    { field: 'name.contains', label: t('user'), type: 'text' },
    { field: 'email.contains', label: t('common:email'), type: 'text' },
    { field: 'company.contains', label: t('company'), type: 'text' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter } = useFilter();

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
  return (
    <>
      <Head>
        <title>{t('users')}</title>
      </Head>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <Signup open={newUser} onClose={handleCloseNewUser} />
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
      <ActualFilter fields={searchFields} actualFilter={filters} />
      <Table
        columns={columns}
        data={data?.users}
        error={error}
        loading={loading}
        actionButtons={[
          { type: 'user-profile', action: userProfile },
          { type: 'user-account', action: userAccount },
          { type: 'settings', action: userSettings },
        ]}
      />
    </>
  );
}
