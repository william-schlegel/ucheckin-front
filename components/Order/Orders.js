import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';

import { perPage } from '../../config';
import useConfirm from '../../lib/useConfirm';
import DisplayError from '../ErrorMessage';
import { Help, HelpButton, useHelp } from '../Help';
import Loading from '../Loading';
import Pagination from '../Pagination';
import SearchField, { ActualFilter, useFilter } from '../SearchField';
import EntetePage from '../styles/EntetePage';
import Number from '../Tables/Number';
import Switch from '../Tables/Switch';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';
import { useUser } from '../User/Queries';
import OrderDetails from './OrderDetails';
import { ALL_ORDERS_QUERY, CANCEL_ORDER_MUTATION, PAGINATION_QUERY } from './Queries';

export default function Orders() {
  const router = useRouter();
  const { user } = useUser();

  const [queryPagination, { error: errorPage, loading: loadingPage, data: dataPage }] =
    useLazyQuery(PAGINATION_QUERY);
  const [queryOrders, { error, loading, data }] = useLazyQuery(ALL_ORDERS_QUERY);
  const [cancelOrderMutation, { error: errorCancel }] = useMutation(CANCEL_ORDER_MUTATION, {
    refetchQueries: [{ query: ALL_ORDERS_QUERY }],
  });
  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const { t } = useTranslation('order');
  const [showOrder, setShowOrder] = useState('');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('order');
  const { addToast } = useToasts();

  const searchFields = [
    { field: 'owner.name.contains', label: t('user'), type: 'text' },
    { field: 'canceled', label: t('canceled'), type: 'switch' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter } = useFilter();

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      take: perPage,
    };
    if (filters) variables.where = filters;
    queryPagination({ variables: filters });
    queryOrders({ variables });
  }, [filters, queryPagination, queryOrders, page]);

  function viewOrder(id) {
    if (id) setShowOrder(id);
  }

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [t('number'), 'number'],
    [t('user'), 'owner.name'],
    [t('order-date'), 'orderDate', ({ cell: { value } }) => <ValidityDate value={value} noColor />],
    [t('total-brut'), 'totalBrut', ({ cell: { value } }) => <Number value={value} money />],
    [t('vat-value'), 'vatValue', ({ cell: { value } }) => <Number value={value} percentage />],
    [t('total-net'), 'totalNet', ({ cell: { value } }) => <Number value={value} money />],
    [t('canceled'), 'canceled', ({ cell: { value } }) => <Switch value={value} disabled />],
  ]);
  const { Confirm, setIsOpen, setArgs } = useConfirm({
    title: t('confirm-cancel'),
    message: t('you-confirm'),
    yesLabel: t('yes-cancel'),
    noLabel: t('no-cancel'),
    callback: (args) => cancelOrderMutation(args),
  });
  function handleCloseShowOrder() {
    setShowOrder('');
  }

  function cancelOrder(id) {
    const order = data.orders.find((o) => o.id === id);
    if (!order) return;
    if (order.canceled) {
      addToast(t('already-canceled'), {
        appearance: 'info',
        autoDismiss: true,
      });
    } else {
      setArgs({ variables: { id } });
      setIsOpen(true);
    }
  }

  const actionButtons = [{ type: 'view', action: viewOrder }];
  if (user?.role?.canManageOrder) {
    actionButtons.push({ type: 'trash', action: cancelOrder });
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (errorCancel) return <DisplayError error={errorCancel} />;
  return (
    <>
      <Head>
        <title>{t('orders')}</title>
      </Head>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <Confirm />
      {showOrder && (
        <OrderDetails open={!!showOrder} onClose={handleCloseShowOrder} id={showOrder} />
      )}
      <EntetePage>
        <h3>{t('orders')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
      </EntetePage>
      <Pagination
        page={page}
        error={errorPage}
        loading={loadingPage}
        count={count}
        pageRef="orders"
        withFilter
        setShowFilter={setShowFilter}
      />
      <SearchField
        fields={searchFields}
        showFilter={showFilter}
        onClose={() => setShowFilter(false)}
        onFilterChange={handleNewFilter}
        isAdmin={user.role?.canManageOrder}
      />
      <ActualFilter fields={searchFields} actualFilter={filters} />
      <Table
        columns={columns}
        data={data?.orders}
        error={error}
        loading={loading}
        actionButtons={actionButtons}
      />
    </>
  );
}
