import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useRef } from 'react';

import { perPage } from '../../config';
import useAction from '../../lib/useAction';
import useForm from '../../lib/useForm';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonValidation from '../Buttons/ButtonValidation';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import FieldError from '../FieldError';
import { Form, FormBodyFull, Label, Row } from '../styles/Card';
import { ALL_EVENTS_QUERY, CREATE_EVENT_MUTATION } from './Queries';

export default function EventNew({ open, onClose }) {
  const router = useRouter();
  const { setAction } = useAction();
  const [createEvent, { loading, error }] = useMutation(CREATE_EVENT_MUTATION, {
    refetchQueries: [
      {
        query: ALL_EVENTS_QUERY,
        variables: { skip: 0, take: perPage },
      },
    ],
    onCompleted: (item) => {
      setAction(`create event ${item.createEvent.id}`);
      router.push(`/event/${item.createEvent.id}`);
    },
  });
  const { t } = useTranslation('event');
  const initialValues = useRef({
    name: '',
  });
  const { inputs, handleChange, validate, validationError } = useForm(initialValues.current, [
    'name',
  ]);

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
