import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';

// import DisplayError from '../ErrorMessage';
import errorMessage from '../../lib/errorMessage';
import ButtonValidation from '../Buttons/ButtonValidation';

const UPDATE_PROFILE_MUTATION = gql`
  mutation UPDATE_PROFILE_MUTATION(
    $id: ID!
    $email: String!
    $name: String!
    $company: String
    $address: String
    $zipCode: String
    $city: String
    $telephone: String
    $contact: String
    $applications: [ApplicationWhereUniqueInput]
    $ownedApps: [ApplicationWhereUniqueInput]
    $role: RoleWhereUniqueInput
    $tokens: [TokenWhereUniqueInput] # $photo: Upload
  ) {
    updateUser(
      id: $id
      data: {
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
        # photo: $photo
      }
    ) {
      id
    }
  }
`;

const UPDATE_PROFILE_PHOTO_MUTATION = gql`
  mutation UPDATE_PROFILE_PHOTO_MUTATION($id: ID!, $photo: Upload) {
    updateUser(id: $id, data: { photo: $photo }) {
      id
      photo {
        publicUrlTransformed(transformation: { width: "200", height: "200" })
      }
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.updateUser));
}

export function UpdatePhoto({ id, photo, onSuccess }) {
  const [updatePhoto, { loading, error }] = useMutation(
    UPDATE_PROFILE_PHOTO_MUTATION,
    {
      variables: {
        id,
        photo,
      },
    }
  );

  function handleValidation() {
    const res = updatePhoto({
      update,
    }).catch((err) => alert(err.message));
    onSuccess(res);
  }

  if (error) {
    errorMessage({ graphqlError: error, title: t('error') });
    return null;
  }

  return (
    <>
      <ButtonValidation disabled={loading} onClick={handleValidation} update />
      {/* {error && <DisplayError error={error} />} */}
    </>
  );
}

UpdatePhoto.propTypes = {
  id: PropTypes.string.isRequired,
  photo: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export function UpdateProfile({ id, updatedProfile, onSuccess }) {
  const { t } = useTranslation('profile');
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

  function handleValidation() {
    updateProfile({
      variables,
      update,
    }).catch((err) => alert(err.message));
    onSuccess();
  }
  if (error) {
    errorMessage({ graphqlError: error, title: t('error') });
    return null;
  }

  return (
    <>
      <ButtonValidation disabled={loading} onClick={handleValidation} update />
      {/* {error && <DisplayError error={t('error', { error })} />} */}
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
    photo: PropTypes.object,
  }),
  onSuccess: PropTypes.func.isRequired,
};
