import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';
import { dateDay } from '../DatePicker';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($where: OrderWhereInput) {
    count: ordersCount(where: $where)
  }
`;

export const ALL_ORDERS_QUERY = gql`
  query ALL_ORDERS_QUERY($skip: Int = 0, $take: Int, $where: OrderWhereInput) {
    orders(
      take: $take
      skip: $skip
      where: $where
      orderBy: { orderDate: desc }
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
    order(where: { id: $id }) {
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
        name
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
    updateOrder(where: { id: $id }, data: { canceled: true }) {
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
    order: data?.order || {
      id: orderId,
      validity: dateDay(),
    },
    orderError: error,
    orderLoading: loading,
  };
}
