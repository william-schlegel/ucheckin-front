import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import useAction from '../../lib/useAction';
import useErrorMessage from '../../lib/useErrorMessage';
import ButtonValidation from '../Buttons/ButtonValidation';
import Loading from '../Loading';
import { UPDATE_PROFILE_MUTATION, UPDATE_PROFILE_PHOTO_MUTATION } from './Queries';

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.updateUser));
}

export function UpdatePhoto({ id, photo, onSuccess }) {
  const { t } = useTranslation('common');
  const { setAction } = useAction();
  const displayError = useErrorMessage();
  const [updatePhoto, { loading, error }] = useMutation(UPDATE_PROFILE_PHOTO_MUTATION, {
    variables: {
      id,
      photo,
    },
    onCompleted: () => setAction('update', 'user', id, 'photo'),
  });

  function handleValidation() {
    const res = updatePhoto({
      update,
    }).catch((err) => alert(err.message));
    onSuccess(res);
  }

  if (error) {
    displayError({ graphqlError: error, title: t('error') });
    return null;
  }

  return (
    <>
      <ButtonValidation disabled={loading} onClick={handleValidation} update />
      {loading && <Loading />}
    </>
  );
}

UpdatePhoto.propTypes = {
  id: PropTypes.string.isRequired,
  photo: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export function UpdateProfile({ id, updatedProfile, onSuccess }) {
  const { t } = useTranslation('user');
  const displayError = useErrorMessage();
  const { setAction } = useAction();
  const [updateProfile, { loading, error }] = useMutation(UPDATE_PROFILE_MUTATION, {
    onCompleted: () => setAction('update', 'user', id, 'profile'),
  });
  const variables = { id, ...updatedProfile, role: updatedProfile.role.id };

  function handleValidation() {
    updateProfile({
      variables,
      update,
    }).catch((err) => alert(err.message));
    onSuccess();
  }
  if (error) {
    displayError({ graphqlError: error, title: t('error') });
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
    country: PropTypes.string,
    telephone: PropTypes.string,
    contact: PropTypes.string,
    role: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
};
