import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import DisplayError from './ErrorMessage';
import ValidationButton from './ValidationButton';

const UPDATE_APPLICATION_MUTATION = gql`
  mutation UPDATE_APPLICATION_MUTATION(
    $id: ID!
    $name: String!
    $apiKey: String!
    $owner: ID!
    $users: [ID!]
    $license: String
    $validity: String
  ) {
    updateApplication(
      id: $id
      data: {
        name: $name
        apiKey: $apiKey
        owner: $owner
        users: $users
        license: $license
        validity: $validity
      }
    ) {
      id
    }
  }
`;

function update(cache, payload) {
  console.log(payload);
  cache.evict(cache.identify(payload.data.updateApplication));
}

export default function UpdateApplication({ id, updatedApp }) {
  const [updateApplication, { loading, error }] = useMutation(
    UPDATE_APPLICATION_MUTATION,
    {
      variables: { id },
      update,
    }
  );

  return (
    <>
      <ValidationButton
        disabled={loading}
        onClick={() => {
          updateApplication(id, updatedApp).catch((err) => alert(err.message));
        }}
        update
      />
      {error && <DisplayError error={error} />}
    </>
  );
}

UpdateApplication.propTypes = {
  id: PropTypes.string,
  updatedApp: PropTypes.shape({
    name: PropTypes.string,
    apiKey: PropTypes.string,
    owner: PropTypes.object,
    users: PropTypes.array,
    license: PropTypes.string,
    validity: PropTypes.string,
  }),
};
