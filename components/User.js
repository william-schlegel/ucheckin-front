import { gql, useQuery } from '@apollo/client';

const CURRENT_USER_QUERY = gql`
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
        role {
          id
          canSeeOtherUsers
          canManageUsers
          canManageRoles
          canManageApplication
          canManageSignal
          canManageLicense
          canBuyLicense
          canManagePrice
          canCreatePrice
          canSeeOrder
          canManageOrder
          canManageVAT
          canManageLicenseType
          canManageEvent
        }
      }
    }
  }
`;

export function useUser() {
  const { data } = useQuery(CURRENT_USER_QUERY);
  return data?.authenticatedItem;
}

export { CURRENT_USER_QUERY };
