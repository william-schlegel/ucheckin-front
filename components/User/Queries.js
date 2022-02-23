import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect, useState } from 'react';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($where: UserWhereInput) {
    count: usersCount(where: $where)
  }
`;

export const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY($skip: Int = 0, $take: Int, $where: UserWhereInput) {
    users(take: $take, skip: $skip, where: $where) {
      id
      name
      email
      role {
        id
        name
      }
      company
      photo {
        publicUrlTransformed(transformation: { width: "200", height: "200" })
      }
    }
  }
`;

export const QUERY_ACCOUNT = gql`
  query QUERY_ACCOUNT($id: ID!) {
    user(where: { id: $id }) {
      id
      name
      company
      ownedApps {
        id
        name
        licenseTypes {
          id
          name
        }
      }
      tokens {
        id
        token
        createdAt
      }
      invitations {
        id
        application {
          name
        }
        status
        updated
      }
      ownedLicenses {
        id
        application {
          id
          name
        }
        signal {
          id
          name
        }
        validity
        licenseType {
          id
        }
      }
      ownedNotifications {
        id
        name
        signal {
          id
          name
        }
      }
    }
  }
`;

export const ADD_TOKEN_MUTATION = gql`
  mutation ADD_TOKEN_MUTATION($ownerId: ID!) {
    createToken(data: { owner: { connect: { id: $ownerId } } }) {
      id
      token
    }
  }
`;

export const DELETE_TOKEN_MUTATION = gql`
  mutation DELETE_TOKEN_MUTATION($id: ID!) {
    deleteToken(where: { id: $id }) {
      id
      token
    }
  }
`;

export const QUERY_PROFILE = gql`
  query QUERY_PROFILE($id: ID!) {
    user(where: { id: $id }) {
      id
      email
      name
      company
      address
      zipCode
      city
      country
      telephone
      contact
      invoicingModel
      photo {
        publicUrlTransformed(transformation: { width: "200", height: "200" })
      }
      role {
        id
        name
        canManageUsers
      }
    }
  }
`;

export const QUERY_SETTINGS = gql`
  query QUERY_SETTINGS($id: ID!) {
    user(where: { id: $id }) {
      id
      canSeeUmitMenu
      canSeeUcheckinMenu
      canSeeAppMenu
      canSeeUmixMenu
      canSeeHBeaconMenu
      role {
        id
        name
        canManageUsers
      }
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CUserUSER_MUTATION($ownerId: ID!) {
    createUser(data: { owner: { connect: { id: $ownerId } } }) {
      id
      name
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($data: UserCreateInput!) {
    createUser(data: $data) {
      id
      email
      name
      company
    }
  }
`;

export const SIGN_OUT_MUTATION = gql`
  mutation {
    endSession
  }
`;

export const CURRENT_USER_QUERY = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        email
        name
        photo {
          publicUrlTransformed(transformation: { width: "200", height: "200" })
        }
        country
        theme
        canSeeUmitMenu
        canSeeUcheckinMenu
        canSeeAppMenu
        canSeeUmixMenu
        canSeeHBeaconMenu
        role {
          id
          canSeeOtherUsers
          canManageUsers
          canManageRoles
          canManageApplication
          canManageSignal
          canManageLicense
          canManagePrice
          canCreatePrice
          canSeeOrder
          canManageOrder
          canManageVAT
          canManageLicenseType
          canManageEvent
          canManageNotification
          canManageUmits
          canManageAllUmix
        }
      }
    }
  }
`;

export const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UPDATE_PROFILE_MUTATION(
    $id: ID!
    $email: String
    $name: String
    $company: String
    $address: String
    $zipCode: String
    $city: String
    $telephone: String
    $contact: String
    $role: RoleRelateToOneForUpdateInput
    $invoicingModel: String
  ) {
    updateUser(
      where: { id: $id }
      data: {
        email: $email
        name: $name
        company: $company
        address: $address
        zipCode: $zipCode
        city: $city
        telephone: $telephone
        contact: $contact
        role: $role
        invoicingModel: $invoicingModel
      }
    ) {
      id
    }
  }
`;

export const UPDATE_SETTINGS_MUTATION = gql`
  mutation UPDATE_SETTINGS_MUTATION(
    $id: ID!
    $canSeeUmitMenu: Boolean
    $canSeeUcheckinMenu: Boolean
    $canSeeAppMenu: Boolean
    $canSeeUmixMenu: Boolean
    $canSeeHBeaconMenu: Boolean
  ) {
    updateUser(
      where: { id: $id }
      data: {
        canSeeUmitMenu: $canSeeUmitMenu
        canSeeUcheckinMenu: $canSeeUcheckinMenu
        canSeeAppMenu: $canSeeAppMenu
        canSeeUmixMenu: $canSeeUmixMenu
        canSeeHBeaconMenu: $canSeeHBeaconMenu
      }
    ) {
      id
    }
  }
`;

export const UPDATE_PROFILE_PHOTO_MUTATION = gql`
  mutation UPDATE_PROFILE_PHOTO_MUTATION($id: ID!, $photo: Upload) {
    updateUser(where: { id: $id }, data: { photo: $photo }) {
      id
      photo {
        publicUrlTransformed(transformation: { width: "200", height: "200" })
      }
    }
  }
`;

export const UPDATE_THEME = gql`
  mutation UPDATE_THEME($userId: ID!, $theme: String!) {
    updateUser(where: { id: $userId }, data: { theme: $theme }) {
      id
    }
  }
`;

const ROLE_QUERY = gql`
  query ROLE_QUERY {
    roles {
      id
      name
    }
  }
`;

export const DELETE_USER = gql`
  mutation DELETE_USER(
    $userId: ID!
    $idApps: [ApplicationWhereUniqueInput!]!
    $idSignals: [SignalWhereUniqueInput!]!
    $idSignalFiles: [SignalFileWhereUniqueInput!]!
    $idLicenses: [LicenseWhereUniqueInput!]!
    $idTokens: [TokenWhereUniqueInput!]!
    $idNotifications: [NotificationWhereUniqueInput!]!
    $idNotificationItems: [NotificationItemWhereUniqueInput!]!
    $idPrices: [LicensePriceWhereUniqueInput!]!
    $idPriceItems: [LicensePriceItemWhereUniqueInput!]!
    $idInvitations: [InvitationWhereUniqueInput!]!
    $idActions: [UserActionWhereUniqueInput!]!
    $idEvents: [EventWhereUniqueInput!]!
  ) {
    deleteUser(where: { id: $id }) {
      id
      name
    }
    deleteApplications(where: $idApps) {
      id
    }
    deleteSignals(where: $idSignals) {
      id
    }
    deleteSignalFiles(where: $idSignalFiles) {
      id
    }
    deleteLicenses(where: $idLicenses) {
      id
    }
    deleteTokens(where: $idTokens) {
      id
    }
    deleteNotifications(where: $idNotifications) {
      id
    }
    deleteNotificationItems(where: $idNotificationItems) {
      id
    }
    deleteLicensePrices(where: $idPrices) {
      id
    }
    deleteLicensePriceItemss(where: $idPriceItems) {
      id
    }
    deleteInvitations(where: $idInvitations) {
      id
    }
    deleteUserActions(where: $idActions) {
      id
    }
    deleteEvents(where: $idEvents) {
      id
    }
  }
`;

export const QUERY_USER_ACTIONS = gql`
  query QUERY_USER_ACTIONS($id: ID!) {
    userActions(where: { user: { id: { equals: $id } } }, orderBy: { dateAction: desc }) {
      id
      dateAction
      name
      itemType
      itemData
    }
  }
`;

export function useUser() {
  const { data, error, loading } = useQuery(CURRENT_USER_QUERY);

  const user = data?.authenticatedItem || {};
  const authenticated = !!data?.authenticatedItem;

  return { user, loading, error, authenticated };
}

export function useRole() {
  const { data } = useQuery(ROLE_QUERY);
  const items = data?.roles;
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    if (items) setRoles(items.map((r) => ({ value: r.id, label: r.name })));
  }, [items]);

  return roles;
}
