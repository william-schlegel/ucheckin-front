import { useRef } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';

import Drawer from '../Drawer';
import DisplayError from '../ErrorMessage';
import ButtonValidation from '../Buttons/ButtonValidation';
import ButtonCancel from '../Buttons/ButtonCancel';
import { ALL_APPLICATIONS_QUERY } from '../../pages/applications/index';
import { DrawerFooter } from '../styles/Drawer';
import { FormBodyFull, Label, Row, Form } from '../styles/Card';
import useForm from '../../lib/useForm';
import { perPage } from '../../config';

const CREATE_APPLICATION_MUTATION = gql`
  mutation CREATE_APPLICATION_MUTATION($name: String!) {
    createApplication(data: { name: $name }) {
      id
    }
  }
`;

export default function ApplicationNew({ open, onClose }) {
  const [createApplication, { loading, error }] = useMutation(
    CREATE_APPLICATION_MUTATION,
    {
      refetchQueries: [
        {
          query: ALL_APPLICATIONS_QUERY,
          variables: { skip: 0, first: perPage },
        },
      ],
    }
  );
  const { t } = useTranslation('application');
  const initialValues = useRef({
    name: '',
  });
  const { inputs, handleChange } = useForm(initialValues.current);

  return (
    <Drawer onClose={onClose} open={open} title={t('new-application')}>
      <Form>
        <FormBodyFull>
          <Row>
            <Label htmlFor="name" required>
              {t('common:name')}
            </Label>
            <input
              required
              type="text"
              id="name"
              name="name"
              value={inputs.name}
              onChange={handleChange}
            />
          </Row>
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonValidation
          disabled={loading}
          onClick={() => {
            createApplication({ variables: inputs }).catch((err) =>
              alert(err.message)
            );
            onClose();
          }}
        />
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

ApplicationNew.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
