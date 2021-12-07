import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { useUser } from '../components/User/Queries';

const MUTATION_ACTION = gql`
  mutation MUTATION_ACTION($action: String!, $user: ID!) {
    createUserAction(data: { name: $action, user: { connect: { id: $user } } }) {
      id
    }
  }
`;

export default function useAction() {
  const [createAction, { data, error }] = useMutation(MUTATION_ACTION);
  const { user } = useUser();

  function setAction(action, userId) {
    if (userId || user.id) {
      createAction({ variables: { action, user: userId || user.id } });
    }
  }

  return { setAction, error, data };
}
