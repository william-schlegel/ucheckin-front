import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import DisplayError from '../ErrorMessage';
import ButtonValidation from '../Buttons/ButtonValidation';
import { UPDATE_APPLICATION_MUTATION } from './Queries';

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.updateApplication));
}

export default function UpdateApplication({ id, updatedApp, onSuccess }) {
  const [updateApplication, { loading, error }] = useMutation(
    UPDATE_APPLICATION_MUTATION
  );
  const { name, apiKey, owner, users, licenseType } = updatedApp;
  const variables = {
    name,
    apiKey,
    ownerId: owner.id,
    users: users.map((u) => ({ id: u.id })),
    licenseTypeId: licenseType,
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
    licenseType: PropTypes.object,
  }),
  onSuccess: PropTypes.func.isRequired,
};
