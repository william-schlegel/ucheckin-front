import { gql, useQuery } from '@apollo/client';

const CURRENT_USER_QUERY = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        email
        name
        photo {
          publicUrlTransformed(transformation: { width: "100", height: "100" })
        }
        country
        role {
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
