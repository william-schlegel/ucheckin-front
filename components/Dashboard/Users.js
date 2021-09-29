import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/dist/client/router';
import Dashboard from '../Dashboard';
import DisplayError from '../ErrorMessage';

import Loading from '../Loading';
import Button from '../Tables/Button';
import Table, { useColumns } from '../Tables/Table';

const nbUser = 5;

const QUERY_USERS = gql`
  query QUERY_USERS {
    users(take: ${nbUser}, orderBy: {creation: desc}) {
      id
      name
      company
      email
      photo {
        publicUrlTransformed(transformation: { width: "200", height: "200" })
      }
    }
    usersCount
  }
`;

export default function DashboardUser() {
  const { t } = useTranslation('dashboard');
  const { error, loading, data } = useQuery(QUERY_USERS);
  const router = useRouter();

  function viewUser(userId) {
    router.push(`/user/${userId}`);
  }

  const columns = useColumns(
    [
      ['id', 'id', 'hidden'],
      [
        t('common:name'),
        'name',
        ({
          column: {
            options: { action },
          },
          cell: { value },
          row: {
            values: { id },
          },
        }) => <Button action={action} label={value} value={id} block />,
        { action: viewUser },
      ],
      [t('common:email'), 'email'],
      [t('user:company'), 'company'],
    ],
    false
  );

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <Dashboard
      title={t('users', { count: data.users.length })}
      total={t('users-total')}
      count={data.usersCount}
    >
      <Table columns={columns} data={data.users} />
    </Dashboard>
  );
}
