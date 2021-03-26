import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/dist/client/router';
import DisplayError from '../ErrorMessage';

import Loading from '../Loading';
import { Card } from '../styles/Card';
import Button from '../Tables/Button';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';
import Number from '../Tables/Number';

const nbApp = 5;

const QUERY_ORDERS = gql`
  query QUERY_ORDERS {
    allOrders(first:${nbApp} , sortBy: orderDate_DESC) {
      id
      number
      orderDate
      user {
        id
        name
      }
      totalBrut
      canceled
    }
  }
`;

export default function DashboardOrder() {
  const { t } = useTranslation('dashboard');
  const { error, loading, data } = useQuery(QUERY_ORDERS);
  const router = useRouter();

  function viewOrder(orderId) {
    router.push(`/order/${orderId}`);
  }

  const columns = useColumns(
    [
      ['id', 'id', 'hidden'],
      ['canceled', 'canceled', 'hidden'],
      [
        t('order:number'),
        'number',
        ({
          column: {
            options: { action },
          },
          cell: { value },
          row: {
            values: { id, canceled },
          },
        }) => (
          <Button
            action={action}
            label={value}
            value={id}
            block
            secondary={canceled}
          />
        ),
        { action: viewOrder },
      ],
      [t('order:user'), 'user.name'],
      [
        t('order:order-date'),
        'orderDate',
        ({ cell: { value } }) => <ValidityDate value={value} noColor />,
      ],
      [
        t('order:total-brut'),
        'totalBrut',
        ({ cell: { value } }) => <Number value={value} money />,
      ],
    ],
    false
  );

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <Card>
      <h2>{t('orders', { count: nbApp })}</h2>
      <Table columns={columns} data={data.allOrders} />
    </Card>
  );
}
