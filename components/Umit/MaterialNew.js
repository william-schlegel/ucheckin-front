import { useLazyQuery, useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { perPage } from '../../config';
import useAction from '../../lib/useAction';
import useForm from '../../lib/useForm';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonValidation from '../Buttons/ButtonValidation';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import FieldError from '../FieldError';
import { Form, FormBodyFull, Label, Row } from '../styles/Card';
import {
  ALL_MATERIALS_QUERY,
  CREATE_MATERIAL_MUTATION,
  MATERIAL_QUERY,
  UPDATE_MATERIAL_MUTATION,
} from './Queries';

export default function MaterialNew({ open, onClose, id }) {
  const [queryMaterial, { data, loading: loadingQuery, error: errorQuery }] =
    useLazyQuery(MATERIAL_QUERY);
  const { setAction } = useAction();
  const [createMaterial, { loading: loadingCreate, error: errorCreate }] = useMutation(
    CREATE_MATERIAL_MUTATION,
    {
      refetchQueries: [
        {
          query: ALL_MATERIALS_QUERY,
          variables: { skip: 0, take: perPage },
        },
      ],
      onCompleted: (data) => setAction('create', 'material', data.createUmitMaterial.id),
    }
  );
  const [updateMaterial, { loading: loadingUpdate, error: errorUpdate }] = useMutation(
    UPDATE_MATERIAL_MUTATION,
    {
      refetchQueries: [
        {
          query: ALL_MATERIALS_QUERY,
          variables: { skip: 0, take: perPage },
        },
      ],
      onCompleted: (data) => setAction('create', 'material', data.updateUmitMaterial.id),
    }
  );

  const { t } = useTranslation('umit');
  const initialValues = useRef({
    name: '',
    propSpeed: 5000,
  });
  const { inputs, handleChange, validate, validationError, setInputs } = useForm(
    initialValues.current,
    ['name', { check: 'isNotNull', key: 'propSpeed' }]
  );

  useEffect(() => {
    if (id) queryMaterial({ variables: { id } });
  }, [id, queryMaterial]);

  useEffect(() => {
    if (data) {
      console.log(`data`, data);
      setInputs({ name: data.umitMaterial.name, propSpeed: data.umitMaterial.propSpeed });
    }
  }, [data, setInputs]);

  function handleValidation() {
    if (!validate()) return;
    if (id) {
      updateMaterial({ variables: { where: { id }, data: inputs } }).catch((err) =>
        alert(err.message)
      );
    } else {
      createMaterial({ variables: { data: inputs } }).catch((err) => alert(err.message));
    }
    onClose();
  }

  if (loadingQuery) return null;

  return (
    <Drawer onClose={onClose} open={open} title={id ? t('new-material') : t('material')}>
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
        <ButtonValidation disabled={loadingCreate || loadingUpdate} onClick={handleValidation} />
        <ButtonCancel onClick={onClose} />
        {errorCreate && <DisplayError error={errorCreate} />}
        {errorUpdate && <DisplayError error={errorUpdate} />}
        {errorQuery && <DisplayError error={errorQuery} />}
      </DrawerFooter>
    </Drawer>
  );
}

MaterialNew.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string,
};

const InputUnit = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
