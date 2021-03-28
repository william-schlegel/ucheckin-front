import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

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
import SearchField, { useFilter } from '../SearchField';

export default function Users() {
  const router = useRouter();

  const [
    queryPagination,
    { error: errorPage, loading: loadingPage, data: dataPage },
  ] = useLazyQuery(PAGINATION_QUERY);
  const [queryUsers, { error, loading, data }] = useLazyQuery(ALL_USERS_QUERY);

  const page = parseInt(router.query.page) || 1;
  const { count } = dataPage?.count || 1;
  const { t } = useTranslation('user');
  const [newUser, setNewUser] = useState(false);
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('user');
  const searchFields = [
    { field: 'name_contains_i', label: t('user'), type: 'text' },
    { field: 'email_contains_i', label: t('common:email'), type: 'text' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter } = useFilter();

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      first: perPage,
    };
    if (filters) variables.where = filters;
    queryPagination({ variables: filters });
    queryUsers({ variables });
  }, [filters, queryPagination, queryUsers, page]);

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
        fields={searchFields}
        showFilter={showFilter}
        onClose={() => setShowFilter(false)}
        onFilterChange={handleNewFilter}
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
