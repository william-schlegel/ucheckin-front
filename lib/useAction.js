import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { useUser } from '../components/User/Queries';

const MUTATION_ACTION = gql`
  mutation MUTATION_ACTION(
    $action: String!
    $itemType: String
    $itemId: String
    $itemData: String
    $user: ID!
  ) {
    createUserAction(
      data: {
        name: $action
        itemType: $itemType
        itemId: $itemId
        itemData: $itemData
        user: { connect: { id: $user } }
      }
    ) {
      id
    }
  }
`;

export default function useAction() {
  const [createAction, { data, error }] = useMutation(MUTATION_ACTION);
  const { user } = useUser();

  function setAction(action, itemType, itemId, itemData, userId) {
    if (userId || user.id) {
      createAction({ variables: { action, itemType, itemId, itemData, user: userId || user.id } });
    }
  }

  return { setAction, error, data };
}
