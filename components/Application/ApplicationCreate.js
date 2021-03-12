import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import DisplayError from '../ErrorMessage';
import ValidationButton from '../ButtonValidation';

const CREATE_APPLICATION_MUTATION = gql`
  mutation CREATE_APPLICATION_MUTATION(
    $name: String!
    $owner: ID!
    $users: [ID!]
    $licenseType: String
    $validity: String
  ) {
    createApplication(
      data: {
        name: $name
        apiKey: $apiKey
        owner: $owner
        users: $users
        licenseType: $licenseType
        validity: $validity
      }
    ) {
      id
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.updateApplication));
}

export default function CreateApplication({ newApp }) {
  const [createApplication, { loading, error }] = useMutation(
    CREATE_APPLICATION_MUTATION,
    {
      update,
    }
  );

  return (
    <>
      <ValidationButton
        disabled={loading}
        onClick={() => {
          createApplication(updatedApp).catch((err) => alert(err.message));
        }}
        update
      />
      {error && <DisplayError error={error} />}
    </>
  );
}

UpdateApplication.propTypes = {
  updatedApp: PropTypes.shape({
    name: PropTypes.string,
    apiKey: PropTypes.string,
    owner: PropTypes.object,
    users: PropTypes.array,
    licenseType: PropTypes.string,
    validity: PropTypes.string,
  }),
};
