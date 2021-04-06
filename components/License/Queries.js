import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';
import { dateDay } from '../DatePicker';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($where: LicenseWhereInput) {
    count: _allLicensesMeta(where: $where) {
      count
    }
  }
`;

export const ALL_LICENSES_QUERY = gql`
  query ALL_LICENSES_QUERY(
    $skip: Int = 0
    $first: Int
    $where: LicenseWhereInput
  ) {
    allLicenses(
      first: $first
      skip: $skip
      where: $where
      sortBy: validity_ASC
    ) {
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
    License(where: { id: $id }) {
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
      }
    }
  }
`;

export const CREATE_TRIAL_LICENSE = gql`
  mutation CREATE_TRIAL_LICENSE(
    $ownerId: ID!
    $appId: ID!
    $trialText: String
  ) {
    createTrial(appId: $appId, ownerId: $ownerId, text: $trialText) {
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
  ) {
    purchaseNewLicenses(
      appId: $appId
      ownerId: $ownerId
      purchaseInfo: $purchaseInfo
      token: $token
      expectedAmountBrut: $expectedAmountBrut
      vatId: $vatId
      purchaseItems: $purchaseItems
    ) {
      id
    }
  }
`;

export const LICENSE_PRICE_QUERY = gql`
  query LICENSE_PRICE_QUERY($dayDate: String!, $owner: ID!) {
    prices: allLicensePrices(
      where: {
        AND: [
          { OR: [{ default: true }, { users_some: { id: $owner } }] }
          { validAfter_lt: $dayDate }
          { validUntil_gte: $dayDate }
        ]
      }
      sortBy: [validAfter_DESC]
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
  mutation UPDATE_LICENSE_MUTATION($id: ID!, $newValidity: String!) {
    updateLicense(id: $id, data: { validity: $newValidity }) {
      id
      validity
    }
  }
`;

export const CREATE_LICENSE_MUTATION = gql`
  mutation CREATE_LICENSE_MUTATION($data: [LicensesCreateInput]!) {
    createLicenses(data: $data) {
      id
    }
  }
`;

export function useFindLicense(licenseId) {
  const [findLicense, { data, error, loading }] = useLazyQuery(LICENSE_QUERY);
  useEffect(() => {
    if (licenseId)
      findLicense({
        variables: { id: licenseId },
      });
  }, [licenseId, findLicense]);
  return {
    license: data?.License || {
      id: licenseId,
      validity: dateDay(),
    },
    licenseError: error,
    licenseLoading: loading,
  };
}
