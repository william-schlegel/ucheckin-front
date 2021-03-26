import { useEffect, useRef, useState } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { Confirm, Report } from 'notiflix';
import useTranslation from 'next-translate/useTranslation';

import SearchField, { useSearch } from '../SearchField';
import Pagination from '../Pagination';
import Table, { useColumns } from '../Tables/Table';
import { perPage } from '../../config';
import Loading from '../Loading';
import DisplayError from '../ErrorMessage';
import EntetePage from '../styles/EntetePage';
import OrderDetails from './OrderDetails';
import Switch from '../Tables/Switch';
import Number from '../Tables/Number';
import ValidityDate from '../Tables/ValidityDate';
import {
  PAGINATION_QUERY,
  ALL_ORDERS_QUERY,
  CANCEL_ORDER_MUTATION,
} from './Queries';
import { useHelp, Help, HelpButton } from '../Help';
import { useUser } from '../User';

export default function Orders() {
  const router = useRouter();
  const { error: errorPage, loading: loadingPage, data: dataPage } = useQuery(
    PAGINATION_QUERY
  );
  const [cancelOrderMutation, { error: errorCancel }] = useMutation(
    CANCEL_ORDER_MUTATION,
    {
      refetchQueries: [{ query: ALL_ORDERS_QUERY }],
    }
  );
  const page = parseInt(router.query.page) || 1;
  const { count } = dataPage?.count || 1;
  const { t } = useTranslation('order');
  const [findOrders, { error, loading, data }] = useLazyQuery(ALL_ORDERS_QUERY);
  const [showOrder, setShowOrder] = useState('');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('order');
  const searchFields = useRef([
    { field: 'user', label: t('user'), type: 'text' },
    { field: 'canceled', label: t('canceled'), type: 'switch' },
  ]);
  const user = useUser();

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
    if (filters.user) variables.user = filters.user;
    if (filters.canceled) variables.canceled = filters.canceled;
    if (variables.filters) variables.skip = 0;
    findOrders({
      variables,
    });
  }, [filters, page, findOrders]);

  function viewOrder(id) {
    if (id) setShowOrder(id);
  }

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [t('number'), 'number'],
    [t('user'), 'user.name'],
    [
      t('order-date'),
      'orderDate',
      ({ cell: { value } }) => <ValidityDate value={value} noColor />,
    ],
    [
      t('total-brut'),
      'totalBrut',
      ({ cell: { value } }) => <Number value={value} money />,
    ],
    [
      t('vat-value'),
      'vatValue',
      ({ cell: { value } }) => <Number value={value} percentage />,
    ],
    [
      t('total-net'),
      'totalNet',
      ({ cell: { value } }) => <Number value={value} money />,
    ],
    [
      t('canceled'),
      'canceled',
      ({ cell: { value } }) => <Switch value={value} disabled />,
    ],
  ]);

  function handleCloseShowOrder() {
    setShowOrder('');
  }

  function cancelOrder(id) {
    const order = data.allOrders.find((o) => o.id === id);
    if (!order) return;
    if (order.canceled) {
      Report.Info(t('cancelation'), t('already-canceled'), t('common:ok'));
      return;
    }
    Confirm.Show(
      t('confirm-cancel'),
      t('you-confirm'),
      t('yes-cancel'),
      t('no-cancel'),
      () => cancelOrderMutation({ variables: { id } })
    );
  }

  const actionButtons = [{ type: 'view', action: viewOrder }];
  if (user?.role.canManageOrder) {
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
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
      {showOrder && (
        <OrderDetails
          open={!!showOrder}
          onClose={handleCloseShowOrder}
          id={showOrder}
        />
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
        fields={searchFields.current}
        setShowFilter={setShowFilter}
        showFilter={showFilter}
        filters={filters}
        setFilters={setFilters}
        handleChange={handleChange}
        query={ALL_ORDERS_QUERY}
        loading={loading}
        resetFilters={resetFilters}
      />
      <Table
        columns={columns}
        data={data?.allOrders}
        error={error}
        loading={loading}
        actionButtons={actionButtons}
      />
    </>
  );
}
