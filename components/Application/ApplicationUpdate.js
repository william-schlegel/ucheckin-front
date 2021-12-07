import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import useAction from '../../lib/useAction';
import ButtonValidation from '../Buttons/ButtonValidation';
import DisplayError from '../ErrorMessage';
import { UPDATE_APPLICATION_MUTATION } from './Queries';

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.updateApplication));
}

export default function UpdateApplication({ id, updatedApp, onSuccess }) {
  const { setAction } = useAction();
  const [updateApplication, { loading, error }] = useMutation(UPDATE_APPLICATION_MUTATION, {
    onCompleted: (data) => setAction(`update application ${data.updateApplication.id}`),
  });

  const { name, apiKey, owner, invitations, licenseTypes } = updatedApp;
  const variables = {
    name,
    apiKey,
    owner: { id: owner.id },
    invitations: invitations.map((l) => ({ id: l.id })),
    licenseTypes,
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
    invitations: PropTypes.array,
    licenseTypes: PropTypes.array,
  }),
  onSuccess: PropTypes.func.isRequired,
};
