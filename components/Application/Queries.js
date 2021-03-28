import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';
import { dateNow } from '../DatePicker';

export const QUERY_APPLICATION = gql`
  query QUERY_APPLICATION($id: ID!) {
    Application(where: { id: $id }) {
      name
      apiKey
      owner {
        id
        name
      }
      users {
        id
        name
      }
      licenseType {
        id
        name
        perArea
      }
      licenses {
        id
        validity
        application {
          id
          name
        }
        signal {
          id
          name
        }
        nbArea
      }
    }
    licenseTypes: allLicenseTypes {
      id
      name
      logo {
        publicUrlTransformed(transformation: { width: "100", height: "100" })
      }
    }
  }
`;

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($where: ApplicationWhereInput) {
    count: _allApplicationsMeta(where: $where) {
      count
    }
  }
`;

export const ALL_APPLICATIONS_QUERY = gql`
  query ALL_APPLICATIONS_QUERY(
    $skip: Int = 0
    $first: Int
    $where: ApplicationWhereInput
  ) {
    allApplications(first: $first, skip: $skip, where: $where) {
      id
      name
      apiKey
      licenseType {
        id
      }
      owner {
        id
        name
      }
      users {
        id
        name
      }
      licenses {
        id
        signal {
          id
          name
        }
        validity
        nbArea
      }
    }
  }
`;

export const CREATE_APPLICATION_MUTATION = gql`
  mutation CREATE_APPLICATION_MUTATION($name: String!) {
    createApplication(data: { name: $name }) {
      id
    }
  }
`;

export const DELETE_APPLICATION_MUTATION = gql`
  mutation DELETE_APPLICATION_MUTATION($id: ID!) {
    deleteApplication(id: $id) {
      id
      name
    }
  }
`;

export const ALL_SIGNAL_OWNER = gql`
  query ALL_SIGNAL_OWNER($ownerId: ID!) {
    allSignals(
      where: {
        owner: { id: $ownerId }
        licenses_every: { signal_is_null: true }
      }
    ) {
      id
      name
      licenses {
        id
        application {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_APPLICATION_MUTATION = gql`
  mutation UPDATE_APPLICATION_MUTATION(
    $id: ID!
    $name: String!
    $apiKey: String!
    $ownerId: ID!
    $users: [UserWhereUniqueInput!]!
    $licenseTypeId: ID!
  ) {
    updateApplication(
      id: $id
      data: {
        name: $name
        apiKey: $apiKey
        owner: { connect: { id: $ownerId } }
        users: { disconnectAll: true, connect: $users }
        licenseType: { connect: { id: $licenseTypeId } }
      }
    ) {
      id
    }
  }
`;

export function useFindApplication(appId) {
  const [findApp, { data, error, loading }] = useLazyQuery(QUERY_APPLICATION);
  useEffect(() => {
    if (appId)
      findApp({
        variables: { id: appId },
      });
  }, [appId, findApp]);
  return {
    application: data?.Application || {
      id: appId,
      name: '',
      apiKey: '',
      licenseType: '',
      validity: dateNow(),
      licenses: [],
    },
    applicationError: error,
    applicationLoading: loading,
  };
}
