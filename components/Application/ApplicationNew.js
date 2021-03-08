import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

import Drawer from '../Drawer';
import DisplayError from '../ErrorMessage';
import ButtonValidation from '../Buttons/ButtonValidation';
import ActionButton from '../Buttons/ActionButton';

const CREATE_APPLICATION_MUTATION = gql`
  mutation CREATE_APPLICATION_MUTATION($name: String!) {
    createApplication(data: { name: $name }) {
      id
    }
  }
`;

function update(cache, payload) {
  console.log(payload);
  cache.evict(cache.identify(payload.data.createApplication));
}

export default function ApplicationNew({ open, onClose }) {
  const [
    createApplication,
    { loading, error },
  ] = useMutation(CREATE_APPLICATION_MUTATION, { update });

  return (
    <Drawer onClose={onClose} open={open}>
      <ButtonValidation
        disabled={loading}
        onClick={() => {
          createApplication({ name: 'name' }).catch((err) =>
            alert(err.message)
          );
        }}
        update
      />
      {error && <DisplayError error={error} />}
    </Drawer>
  );
}

ApplicationNew.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
