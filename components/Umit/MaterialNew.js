import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import styled from 'styled-components';

import { perPage } from '../../config';
import useForm from '../../lib/useForm';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonValidation from '../Buttons/ButtonValidation';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import FieldError from '../FieldError';
import { Form, FormBodyFull, Label, Row } from '../styles/Card';
import { ALL_MATERIALS_QUERY, CREATE_MATERIAL_MUTATION } from './Queries';

export default function MaterialNew({ open, onClose }) {
  const [createMaterial, { loading, error }] = useMutation(CREATE_MATERIAL_MUTATION, {
    refetchQueries: [
      {
        query: ALL_MATERIALS_QUERY,
        variables: { skip: 0, take: perPage },
      },
    ],
  });
  const { t } = useTranslation('umit');
  const initialValues = useRef({
    name: '',
    propSpeed: 5000,
  });
  const { inputs, handleChange, validate, validationError } = useForm(initialValues.current, [
    'name',
    { check: 'isNotNull', key: 'propSpeed' },
  ]);

  return (
    <Drawer onClose={onClose} open={open} title={t('new-material')}>
      <Form>
        <FormBodyFull>
          <Row>
            <Label htmlFor="name" required>
              {t('material-name')}
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
          <Row>
            <Label htmlFor="propSpeed" required>
              {t('prop-speed')}
            </Label>
            <InputUnit>
              <input
                type="number"
                id="propSpeed"
                name="propSpeed"
                value={inputs.propSpeed}
                onChange={handleChange}
                required
              />
              <span>m/s</span>
            </InputUnit>
            <FieldError error={validationError.propSpeed} />
          </Row>
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonValidation
          disabled={loading}
          onClick={() => {
            if (!validate()) return;
            createMaterial({ variables: { data: inputs } }).catch((err) => alert(err.message));
            onClose();
          }}
        />
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

MaterialNew.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

const InputUnit = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
