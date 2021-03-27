import { useEffect, useRef, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
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
import Signup from './SignUp';
import { PAGINATION_QUERY, ALL_USERS_QUERY } from './Queries';
import { useHelp, Help, HelpButton } from '../Help';
import Avatar from '../Tables/Avatar';

export default function Users() {
  const router = useRouter();
  const { error: errorPage, loading: loadingPage, data: dataPage } = useQuery(
    PAGINATION_QUERY
  );

  const page = parseInt(router.query.page) || 1;
  const { count } = dataPage?.count || 1;
  const { t } = useTranslation('user');
  const [findUsers, { error, loading, data }] = useLazyQuery(ALL_USERS_QUERY);
  const [newUser, setNewUser] = useState(false);
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('user');
  const searchFields = useRef([
    { field: 'name', label: t('user'), type: 'text' },
    { field: 'email', label: t('common:email'), type: 'text' },
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
    if (filters.email) variables.email = filters.email;
    if (variables.filters) variables.skip = 0;
    findUsers({
      variables,
    });
  }, [filters, page, findUsers]);

  function editUser(id) {
    if (id) router.push(`/user/${id}`);
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
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
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
        fields={searchFields.current}
        setShowFilter={setShowFilter}
        showFilter={showFilter}
        filters={filters}
        setFilters={setFilters}
        handleChange={handleChange}
        query={ALL_USERS_QUERY}
        loading={loading}
        resetFilters={resetFilters}
      />
      <Table
        columns={columns}
        data={data?.allUsers}
        error={error}
        loading={loading}
        actionButtons={[{ type: 'edit', action: editUser }]}
      />
    </>
  );
}
