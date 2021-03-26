import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';
import { dateNow } from '../DatePicker';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    count: _allLicensesMeta {
      count
    }
  }
`;

export const ALL_LICENSES_QUERY = gql`
  query ALL_LICENSES_QUERY($skip: Int = 0, $first: Int, $ownerId: ID) {
    allLicenses(
      first: $first
      skip: $skip
      where: { owner: { id: $ownerId } }
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

export const ACTIVATE_TRIAL_MUTATION = gql`
  mutation ACTIVATE_TRIAL_MUTATION(
    $ownerId: ID!
    $appId: ID!
    $signalId: ID!
    $licenseTypeId: ID!
    $dateValidite: String!
    $trialText: String
  ) {
    createLicense(
      data: {
        owner: { connect: { id: $ownerId } }
        application: { connect: { id: $appId } }
        signal: { connect: { id: $signalId } }
        licenseType: { connect: { id: $licenseTypeId } }
        trialLicense: true
        validity: $dateValidite
        purchaseInformation: $trialText
        nbArea: 1
      }
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
      validity: dateNow(),
    },
    licenseError: error,
    licenseLoading: loading,
  };
}
