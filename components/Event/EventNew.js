import { useRef } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import ButtonValidation from '../Buttons/ButtonValidation';
import ButtonCancel from '../Buttons/ButtonCancel';
import { ALL_EVENTS_QUERY, CREATE_EVENT_MUTATION } from './Queries';
import { FormBodyFull, Label, Row, Form } from '../styles/Card';
import useForm from '../../lib/useForm';
import { perPage } from '../../config';
import FieldError from '../FieldError';

export default function EventNew({ open, onClose }) {
  const router = useRouter();
  const [createEvent, { loading, error }] = useMutation(CREATE_EVENT_MUTATION, {
    refetchQueries: [
      {
        query: ALL_EVENTS_QUERY,
        variables: { skip: 0, take: perPage },
      },
    ],
    onCompleted: (item) => {
      router.push(`/event/${item.createEvent.id}`);
    },
  });
  const { t } = useTranslation('event');
  const initialValues = useRef({
    name: '',
  });
  const {
    inputs,
    handleChange,
    validate,
    validationError,
  } = useForm(initialValues.current, ['name']);

  function handleValidation() {
    if (!validate()) return;
    createEvent({ variables: inputs }).catch((err) => alert(err.message));
    onClose();
  }

  return (
    <Drawer onClose={onClose} open={open} title={t('new-event')}>
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
        <ButtonValidation disabled={loading} onClick={handleValidation} />
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

EventNew.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
