import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import DisplayError from '../ErrorMessage';
import ButtonValidation from '../Buttons/ButtonValidation';

const UPDATE_PROFILE_MUTATION = gql`
  mutation UPDATE_PROFILE_MUTATION(
    $id: ID!
    $email: email!
    $name: name!
    $company: company
    $address: address
    $zipCode: zipCode
    $city: city
    $telephone: telephone
    $contact: contact
    $applications: [ApplicationWhereUniqueInput]
    $ownedApps: [ApplicationWhereUniqueInput]
    $role: RoleWhereUniqueInput
    $tokens: [TokenWhereUniqueInput]
  ) {
    updateUser(
      id: $id
      data: {
        id: $id
        email: $email
        name: $name
        company: $company
        address: $address
        zipCode: $zipCode
        city: $city
        telephone: $telephone
        contact: $contact
        applications: { disconnectAll: true, connect: $applications }
        ownedApps: { disconnectAll: true, connect: $ownedApps }
        role: { connect: $role }
        tokens: { disconnectAll: true, connect: $tokens }
      }
    ) {
      id
    }
  }
`;

function update(cache, payload) {
  console.log('payload', payload);
  cache.evict(cache.identify(payload.data.updateApplication));
}

export default function UpdateProfile({ id, updatedProfile, onSuccess }) {
  const [updateProfile, { loading, error }] = useMutation(
    UPDATE_PROFILE_MUTATION
  );
  const {
    email,
    name,
    company,
    address,
    zipCode,
    city,
    telephone,
    contact,
    applications,
    ownedApps,
    role,
    tokens,
  } = updatedProfile;
  const variables = {
    id,
    email,
    name,
    company,
    address,
    zipCode,
    city,
    telephone,
    contact,
    applications: applications.map((a) => ({ id: a.id })),
    ownedApps: ownedApps.map((a) => ({ id: a.id })),
    role: { id: role.id },
    tokens: tokens.map((a) => ({ id: a.id })),
  };

  return (
    <>
      <ButtonValidation
        disabled={loading}
        onClick={() => {
          updateProfile({
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

UpdateProfile.propTypes = {
  id: PropTypes.string,
  updatedProfile: PropTypes.shape({
    email: PropTypes.string,
    name: PropTypes.string,
    company: PropTypes.string,
    address: PropTypes.string,
    zipCode: PropTypes.string,
    city: PropTypes.string,
    telephone: PropTypes.string,
    contact: PropTypes.string,
    applications: PropTypes.array,
    ownedApps: PropTypes.array,
    role: PropTypes.object,
    tokens: PropTypes.array,
  }),
  onSuccess: PropTypes.func.isRequired,
};
