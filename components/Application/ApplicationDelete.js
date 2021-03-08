import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Router from 'next/router';

import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import ButtonDelete from '../Buttons/ButtonDelete';
import DisplayError from '../ErrorMessage';
import { ALL_APPLICATIONS_QUERY } from '../../pages/applications/index';
import { perPage } from '../../config';
import Modale from '../Modale';

const DELETE_APPLICATION_MUTATION = gql`
  mutation DELETE_APPLICATION_MUTATION($id: ID!) {
    deleteApplication(id: $id) {
      id
      name
    }
  }
`;

export default function DeleteApplication({ id }) {
  const [deleteApplication, { loading, error }] = useMutation(
    DELETE_APPLICATION_MUTATION,
    {
      variables: { id },
      refetchQueries: [
        {
          query: ALL_APPLICATIONS_QUERY,
          variables: { skip: 0, first: perPage },
        },
      ],
    }
  );
  const { t } = useTranslation('common');
  const [showModale, setShowModale] = useState(false);
  function handleConfirm() {
    deleteApplication().catch((err) => alert(err.message));
    Router.push('/applications');
  }

  return (
    <>
      <Modale
        isOpen={showModale}
        setIsOpen={setShowModale}
        title={t('confirm-delete')}
        actionButtons={[<ButtonDelete onClick={handleConfirm} />]}
      />
      <ButtonDelete disabled={loading} onClick={() => setShowModale(true)} />
      {error && <DisplayError error={error} />}
    </>
  );
}

DeleteApplication.propTypes = {
  id: PropTypes.string,
};
