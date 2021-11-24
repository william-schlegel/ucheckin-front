import { useLazyQuery, useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

import { perPage } from '../../config';
import useForm from '../../lib/useForm';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonValidation from '../Buttons/ButtonValidation';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import FieldError from '../FieldError';
import { Form, FormBodyFull, Label, Row } from '../styles/Card';
import {
  ALL_LOCATIONS_QUERY,
  CREATE_LOCATION_MUTATION,
  LOCATION_QUERY,
  UPDATE_LOCATION_MUTATION,
} from './Queries';

export default function LocationNew({ open, onClose, id }) {
  const [queryLocation, { data, loading: loadingQuery, error: errorQuery }] =
    useLazyQuery(LOCATION_QUERY);
  const [createLocation, { loading: loadingCreate, error: errorCreate }] = useMutation(
    CREATE_LOCATION_MUTATION,
    {
      refetchQueries: [
        {
          query: ALL_LOCATIONS_QUERY,
          variables: { skip: 0, take: perPage },
        },
      ],
    }
  );
  const [updateLocation, { loading: loadingUpdate, error: errorUpdate }] = useMutation(
    UPDATE_LOCATION_MUTATION,
    {
      refetchQueries: [
        {
          query: ALL_LOCATIONS_QUERY,
          variables: { skip: 0, take: perPage },
        },
      ],
    }
  );
  const { t } = useTranslation('umit');
  const initialValues = useRef({
    name: '',
    address: '',
    zipCode: '',
    city: '',
    country: 'FR',
    contact: '',
    telephone: '',
  });
  const { inputs, handleChange, validate, validationError, setInputs } = useForm(
    initialValues.current,
    ['name']
  );

  useEffect(() => {
    if (id) queryLocation({ variables: { id } });
  }, [id, queryLocation]);

  useEffect(() => {
    if (data) {
      setInputs({
        name: data.umitLocation.name,
        address: data.umitLocation.address,
        zipCode: data.umitLocation.zipCode,
        city: data.umitLocation.city,
        country: data.umitLocation.country,
        contact: data.umitLocation.contact,
        telephone: data.umitLocation.telephone,
      });
    }
  }, [data, setInputs]);

  function handleValidation() {
    if (!validate()) return;
    if (id) {
      updateLocation({ variables: { where: { id }, data: inputs } }).catch((err) =>
        alert(err.message)
      );
    } else {
      createLocation({ variables: { data: inputs } }).catch((err) => alert(err.message));
    }
    onClose();
  }

  if (loadingQuery) return null;

  return (
    <Drawer onClose={onClose} open={open} title={t('new-location')}>
      <Form>
        <FormBodyFull>
          <Row>
            <Label htmlFor="name" required>
              {t('name')}
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
            <Label htmlFor="address">{t('address')}</Label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={inputs.address}
              onChange={handleChange}
            />
            <FieldError error={validationError.address} />
          </Row>
          <Row>
            <Label htmlFor="zipCode">{t('zip-code')}</Label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={inputs.zipCode}
              onChange={handleChange}
            />
            <FieldError error={validationError.zipCode} />
          </Row>
          <Row>
            <Label htmlFor="city">{t('city')}</Label>
            <input type="text" id="city" name="city" value={inputs.city} onChange={handleChange} />
            <FieldError error={validationError.city} />
          </Row>
          <Row>
            <Label htmlFor="contact">{t('contact')}</Label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={inputs.contact}
              onChange={handleChange}
            />
            <FieldError error={validationError.contact} />
          </Row>
          <Row>
            <Label htmlFor="telephone">{t('telephone')}</Label>
            <input
              type="text"
              id="telephone"
              name="telephone"
              value={inputs.telephone}
              onChange={handleChange}
            />
            <FieldError error={validationError.telephone} />
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

LocationNew.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
