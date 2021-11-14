import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import useTranslation from 'next-translate/useTranslation';

import Dashboard from '../Dashboard';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import Button from '../Tables/Button';
import Number from '../Tables/Number';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';

const nbApp = 5;

const QUERY_ORDERS = gql`
  query QUERY_ORDERS {
    orders(take:${nbApp} , orderBy: {orderDate: desc}) {
      id
      number
      orderDate
      owner {
        id
        name
      }
      totalBrut
      canceled
    }
    ordersCount
  }
`;

export default function DashboardInvoice() {
  const { t } = useTranslation('dashboard');
  const { error, loading, data } = useQuery(QUERY_ORDERS);
  const router = useRouter();

  function viewInvoice(orderId) {
    router.push(`/invoice/${orderId}`);
  }

  const columns = useColumns(
    [
      ['id', 'id', 'hidden'],
      ['canceled', 'canceled', 'hidden'],
      [
        t('invoice:number'),
        'number',
        ({
          column: {
            options: { action },
          },
          cell: { value },
          row: {
            values: { id, canceled },
          },
        }) => <Button action={action} label={value} value={id} block secondary={canceled} />,
        { action: viewInvoice },
      ],
      [t('invoice:user'), 'owner.name'],
      [
        t('invoice:Invoice-date'),
        'orderDate',
        ({ cell: { value } }) => <ValidityDate value={value} noColor />,
      ],
      [
        t('invoice:total-brut'),
        'totalBrut',
        ({ cell: { value } }) => <Number value={value} money />,
      ],
    ],
    false
  );

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <Dashboard
      title={t('invoices', { count: data.orders.length })}
      total={t('invoices-total')}
      count={data.ordersCount}
    >
      <Table columns={columns} data={data.orders} />
    </Dashboard>
  );
}
