import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';
import { dateDay } from '../DatePicker';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($where: OrderWhereInput) {
    count: _allOrdersMeta(where: $where) {
      count
    }
  }
`;

export const ALL_ORDERS_QUERY = gql`
  query ALL_ORDERS_QUERY($skip: Int = 0, $first: Int, $where: OrderWhereInput) {
    allOrders(
      first: $first
      skip: $skip
      where: $where
      sortBy: orderDate_DESC
    ) {
      id
      number
      owner {
        id
        name
      }
      items {
        id
        licenseType {
          id
          name
        }
        quantity
        nbArea
        unitPrice
      }
      totalBrut
      vatValue
      totalNet
      orderDate
      canceled
    }
  }
`;

export const ORDER_QUERY = gql`
  query ORDER_QUERY($id: ID!) {
    Order(where: { id: $id }) {
      id
      number
      owner {
        id
        name
        company
        address
        zipCode
        city
        country
      }
      items {
        id
        licenseType {
          id
          name
        }
        quantity
        nbArea
        unitPrice
      }
      totalBrut
      vatValue
      totalNet
      orderDate
      canceled
    }
  }
`;

export const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($data: OrderCreateInput!) {
    createOrder(data: $data) {
      id
    }
  }
`;

export const CANCEL_ORDER_MUTATION = gql`
  mutation CANCEL_ORDER_MUTATION($id: ID!) {
    updateOrder(id: $id, data: { canceled: true }) {
      id
    }
  }
`;

export function useFindOrder(orderId) {
  const [findOrder, { data, error, loading }] = useLazyQuery(ORDER_QUERY);
  useEffect(() => {
    if (orderId)
      findOrder({
        variables: { id: orderId },
      });
  }, [orderId, findOrder]);
  return {
    order: data?.Order || {
      id: orderId,
      validity: dateDay(),
    },
    orderError: error,
    orderLoading: loading,
  };
}
