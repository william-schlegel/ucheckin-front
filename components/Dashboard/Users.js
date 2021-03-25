import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/dist/client/router';
import DisplayError from '../ErrorMessage';

import Loading from '../Loading';
import { Card } from '../styles/Card';
import Button from '../Tables/Button';
import Table, { useColumns } from '../Tables/Table';

const nbUser = 5;

const QUERY_USERS = gql`
  query QUERY_USERS {
    allUsers(first: 5, sortBy: creation_DESC) {
      id
      name
      company
      email
      photo {
        publicUrlTransformed(transformation: { width: "100", height: "100" })
      }
    }
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
    <Card>
      <h2>{t('users', { count: nbUser })}</h2>
      <Table columns={columns} data={data.allUsers} />
    </Card>
  );
}
