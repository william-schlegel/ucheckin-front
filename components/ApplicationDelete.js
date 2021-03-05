import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import DeleteButton from './DeleteButton';
import DisplayError from './ErrorMessage';

const DELETE_APPLICATION_MUTATION = gql`
  mutation DELETE_APPLICATION_MUTATION($id: ID!) {
    deleteApplication(id: $id) {
      id
      name
    }
  }
`;

function update(cache, payload) {
  console.log(payload);
  cache.evict(cache.identify(payload.data.deleteApplication));
}

export default function DeleteApplication({ id }) {
  const [deleteApplication, { loading, error }] = useMutation(
    DELETE_APPLICATION_MUTATION,
    {
      variables: { id },
      update,
    }
  );

  return (
    <>
      <DeleteButton
        disabled={loading}
        onClick={() => {
          if (confirm('Are you sure you want to delete this item?')) {
            // go ahead and delete it
            console.log('DELTEe');
            deleteApplication().catch((err) => alert(err.message));
          }
        }}
      />
      {error && <DisplayError error={error} />}
    </>
  );
}

DeleteApplication.propTypes = {
  id: PropTypes.string,
};
