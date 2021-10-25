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

export const CREATE_USER_MUTATION = gql`
  mutation CUserUSER_MUTATION($ownerId: ID!) {
    createUser(data: { owner: { connect: { id: $ownerId } } }) {
      id
      name
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!, $company: String!) {
    createUser(data: { email: $email, name: $name, password: $password, company: $company }) {
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

export function useUser() {
  const { data, error, loading } = useQuery(CURRENT_USER_QUERY);
  // const [user, setUser] = useState({});
  // const [authenticated, setAuthenticated] = useState(false);

  // console.log(`data`, data);
  // useEffect(() => {
  //   if (!loading) {
  //     if (data && !data.authenticatedItem) {
  //       setAuthenticated(false);
  //     }
  //     if (data?.authenticatedItem) {
  //       setAuthenticated(true);
  //       setUser(data.authenticatedItem);
  //     }
  //   }
  // }, [data, loading]);

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
