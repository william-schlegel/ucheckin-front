import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';

export const PAGINATION_PRICE_QUERY = gql`
  query PAGINATION_PRICE_QUERY($where: LicensePriceWhereInput) {
    count: licensePricesCount(where: $where)
  }
`;
export const ALL_PRICES_QUERY = gql`
  query ALL_LICENSES_PRICES_QUERY($skip: Int = 0, $take: Int, $where: LicensePriceWhereInput) {
    licensePrices(take: $take, skip: $skip, where: $where) {
      id
      users {
        id
        name
      }
      default
      validAfter
      validUntil
      observation
      owner {
        id
        name
      }
    }
  }
`;

export const PRICE_QUERY = gql`
  query PRICE_QUERY($id: ID!) {
    licensePrice(where: { id: $id }) {
      id
      users {
        id
        name
      }
      default
      validAfter
      validUntil
      creation
      observation
      owner {
        id
        name
      }
      items {
        id
        type
        licenseType {
          id
          name
          logo {
            publicUrlTransformed(transformation: { width: "100", height: "100" })
          }
        }
        monthly
        yearly
        unitPrice
      }
    }
  }
`;

export const CREATE_PRICE_MUTATION = gql`
  mutation CREATE_PRICE_MUTATION($data: LicensePriceCreateInput!) {
    createLicensePrice(data: $data) {
      id
    }
  }
`;

export function useFindPrice(priceId) {
  const [findPrice, { data, error, loading }] = useLazyQuery(PRICE_QUERY);
  useEffect(() => {
    if (priceId)
      findPrice({
        variables: { id: priceId },
      });
  }, [priceId, findPrice]);
  return {
    price: data?.price || {
      id: priceId,
    },
    priceError: error,
    priceLoading: loading,
  };
}
