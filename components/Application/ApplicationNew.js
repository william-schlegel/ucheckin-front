import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useRef } from 'react';

import { perPage } from '../../config';
import useForm from '../../lib/useForm';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonValidation from '../Buttons/ButtonValidation';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import FieldError from '../FieldError';
import { Form, FormBodyFull, Label, Row } from '../styles/Card';
import { ALL_APPLICATIONS_QUERY, CREATE_APPLICATION_MUTATION } from './Queries';

export default function ApplicationNew({ open, onClose }) {
  const [createApplication, { loading, error }] = useMutation(CREATE_APPLICATION_MUTATION, {
    refetchQueries: [
      {
        query: ALL_APPLICATIONS_QUERY,
        variables: { skip: 0, take: perPage },
      },
    ],
  });
  const { t } = useTranslation('application');
  const initialValues = useRef({
    name: '',
  });
  const { inputs, handleChange, validate, validationError } = useForm(initialValues.current, [
    'name',
  ]);

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
            <FieldError error={validationError.name} />
          </Row>
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonValidation
          disabled={loading}
          onClick={() => {
            if (!validate()) return;
            createApplication({ variables: inputs }).catch((err) => alert(err.message));
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
