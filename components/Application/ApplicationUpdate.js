import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import DisplayError from '../ErrorMessage';
import ButtonValidation from '../Buttons/ButtonValidation';

const UPDATE_APPLICATION_MUTATION = gql`
  mutation UPDATE_APPLICATION_MUTATION(
    $id: ID!
    $name: String!
    $apiKey: String!
    $owner: UserWhereUniqueInput!
    $users: [UserWhereUniqueInput!]!
    $licenseType: String
    $validity: String
  ) {
    updateApplication(
      id: $id
      data: {
        name: $name
        apiKey: $apiKey
        owner: { connect: $owner }
        users: { disconnectAll: true, connect: $users }
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

export default function UpdateApplication({ id, updatedApp, onSuccess }) {
  const [updateApplication, { loading, error }] = useMutation(
    UPDATE_APPLICATION_MUTATION
  );
  const { name, apiKey, owner, users, licenseType, validity } = updatedApp;
  const variables = {
    name,
    apiKey,
    owner: { id: owner.key },
    users: users.map((u) => ({ id: u.key })),
    licenseType,
    validity,
    id,
  };

  return (
    <>
      <ButtonValidation
        disabled={loading}
        onClick={() => {
          updateApplication({
            variables,
            update,
          }).catch((err) => alert(err.message));
          onSuccess();
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
    licenseType: PropTypes.string,
    validity: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
};
