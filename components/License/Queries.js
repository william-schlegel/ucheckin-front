import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { dateDay } from '../DatePicker';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($where: LicenseWhereInput) {
    count: licensesCount(where: $where)
  }
`;

export const ALL_LICENSES_QUERY = gql`
  query ALL_LICENSES_QUERY($skip: Int = 0, $take: Int, $where: LicenseWhereInput) {
    licenses(take: $take, skip: $skip, where: $where, orderBy: { validity: asc }) {
      id
      signal {
        id
        name
      }
      application {
        id
        name
      }
      validity
      valid
      owner {
        id
        name
      }
      licenseType {
        id
      }
      trialLicense
      purchaseDate
      purchaseInformation
      nbArea
    }
  }
`;

export const LICENSE_QUERY = gql`
  query LICENSE_QUERY($id: ID!) {
    license(where: { id: $id }) {
      id
      signal {
        id
        name
      }
      application {
        id
        name
      }
      validity
      valid
      purchaseDate
      purchaseInformation
      trialLicense
      nbArea
      owner {
        id
        name
      }
      licenseType {
        id
        name
        perArea
      }
      orderItems {
        id
        name
        quantity
        nbArea
        order {
          orderDate
        }
      }
    }
  }
`;

export const CREATE_TRIAL_LICENSE = gql`
  mutation CREATE_TRIAL_LICENSE($ownerId: ID!, $appId: ID!, $trialText: String, $signalId: ID) {
    createTrial(appId: $appId, ownerId: $ownerId, text: $trialText, signalId: $signalId) {
      id
    }
  }
`;

export const PURCHASE_LICENSE_MUTATION = gql`
  mutation PURCHASE_LICENSE_MUTATION(
    $appId: ID!
    $ownerId: ID!
    $purchaseInfo: String!
    $purchaseItems: [PurchaseLicenseItem!]!
    $token: String!
    $expectedAmountBrut: Float!
    $vatId: ID
    $signalId: ID
  ) {
    purchaseNewLicenses(
      appId: $appId
      ownerId: $ownerId
      purchaseInfo: $purchaseInfo
      token: $token
      expectedAmountBrut: $expectedAmountBrut
      vatId: $vatId
      purchaseItems: $purchaseItems
      signalId: $signalId
    ) {
      id
    }
  }
`;

export const LICENSE_PRICE_QUERY = gql`
  query LICENSE_PRICE_QUERY($dayDate: DateTime!, $owner: ID!) {
    prices: licensePrices(
      where: {
        AND: [
          { OR: [{ default: { equals: true } }, { users: { some: { id: { equals: $owner } } } }] }
          { validAfter: { lt: $dayDate } }
          { validUntil: { gte: $dayDate } }
        ]
      }
      orderBy: [{ validAfter: desc }]
    ) {
      id
      default
      items {
        id
        licenseType {
          id
          name
          perArea
        }
        monthly
        yearly
      }
      users {
        id
        name
      }
      owner {
        id
      }
    }
  }
`;

export const UPDATE_LICENSE_MUTATION = gql`
  mutation UPDATE_LICENSE_MUTATION(
    $licenseId: ID!
    $purchaseItems: [PurchaseLicenseItem!]!
    $token: String!
    $expectedAmountBrut: Float!
    $vatId: ID
  ) {
    extendLicense(
      licenseId: $licenseId
      token: $token
      expectedAmountBrut: $expectedAmountBrut
      vatId: $vatId
      purchaseItems: $purchaseItems
    ) {
      id
    }
  }
`;

export function useFindLicense(licenseId) {
  const { data, error, loading } = useQuery(LICENSE_QUERY, {
    variables: { id: licenseId },
  });

  return {
    license: data?.license || {
      id: licenseId,
      validity: dateDay(),
      licenseType: {},
      signal: {},
      application: {},
      owner: {},
    },
    licenseError: error,
    licenseLoading: loading,
  };
}
