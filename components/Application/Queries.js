import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { dateDay } from '../DatePicker';

export const APPLICATION_QUERY = gql`
  query APPLICATION_QUERY($id: ID!) {
    Application(where: { id: $id }) {
      id
      name
      apiKey
      owner {
        id
        name
      }
      invitations {
        id
        email
        status
        updated
      }
      licenseTypes {
        id
        name
        perArea
      }
      licenses {
        id
        validity
        licenseType {
          id
        }
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
      licenseTypes {
        id
      }
      owner {
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
    $name: String
    $apiKey: String
    $owner: UserRelateToOneInput
    $licenseTypes: LicenseTypeRelateToManyInput
  ) {
    updateApplication(
      id: $id
      data: {
        name: $name
        apiKey: $apiKey
        owner: $owner
        licenseTypes: $licenseTypes
      }
    ) {
      id
    }
  }
`;

export const CREATE_INVITATION_MUTATION = gql`
  mutation CREATE_INVITATION_MUTATION(
    $appId: ID!
    $email: String!
    $canModifyApplication: Boolean
    $canManageContent: Boolean
    $canBuyLicenses: Boolean
  ) {
    addInvitation(
      email: $email
      appId: $appId
      canModifyApplication: $canModifyApplication
      canManageContent: $canManageContent
      canBuyLicenses: $canBuyLicenses
    ) {
      id
      email
      status
      updated
    }
  }
`;

export const DELETE_INVITATION = gql`
  mutation DELETE_INVITATION($invitationId: ID!) {
    deleteInvitation(id: $invitationId) {
      id
    }
  }
`;

export const CHECK_INVITATION_TOKEN = gql`
  query CHECK_INVITATION_TOKEN($token: String!) {
    allInvitations(where: { token: $token }) {
      id
      application {
        id
        name
      }
      user {
        id
        name
        email
      }
    }
  }
`;

export const UPDATE_INVITATION = gql`
  mutation UPDATE_INVITATION($token: String!, $accept: Boolean!) {
    updateInvitationStatus(token: $token, accept: $accept) {
      id
    }
  }
`;

export const CREATE_ACCOUNT_INVITATION = gql`
  mutation CREATE_ACCOUNT_INVITATION(
    $token: String!
    $name: String!
    $company: String!
    $password: String!
  ) {
    createAccountInvitation(
      token: $token
      name: $name
      company: $company
      password: $password
    ) {
      id
    }
  }
`;

export function useFindApplication(appId) {
  const { data, error, loading } = useQuery(APPLICATION_QUERY, {
    variables: { id: appId },
  });
  // console.log(`useFindApplication - data`, data);

  return {
    application: data?.Application || {
      id: appId,
      name: '',
      apiKey: '',
      licenseTypes: [],
      validity: dateDay(),
      licenses: [],
    },
    applicationError: error,
    applicationLoading: loading,
  };
}
