import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { useEffect } from 'react';

const FIND_USER_QUERY = gql`
  query FIND_USER_QUERY($userId: ID!) {
    User(where: { id: $userId }) {
      id
      name
      email
    }
  }
`;

export default function useFindUser(userId) {
  const [findUser, { data, error, loading }] = useLazyQuery(FIND_USER_QUERY);
  useEffect(() => {
    if (userId)
      findUser({
        variables: { userId },
      });
  }, [userId, findUser]);
  return {
    user: data?.User || { id: userId, name: '', email: '' },
    userError: error,
    userLoading: loading,
  };
}
