import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

const FIND_USER_QUERY = gql`
  query FIND_USER_QUERY($userId: ID!) {
    user(where: { id: $userId }) {
      id
      name
      email
      invoicingModel
    }
  }
`;

export default function useFindUser(userId) {
  // console.log(`useFindUser - userId`, userId);
  const { data, error, loading } = useQuery(FIND_USER_QUERY, {
    variables: { userId },
  });

  // console.log(`useFindUser - data`, data);

  return {
    user: data?.user || { id: userId, name: '', email: '' },
    userError: error,
    userLoading: loading,
  };
}
