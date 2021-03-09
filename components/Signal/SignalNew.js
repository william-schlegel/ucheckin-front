import { useRef } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';

import Drawer from '../Drawer';
import DisplayError from '../ErrorMessage';
import ButtonValidation from '../Buttons/ButtonValidation';
import ButtonCancel from '../Buttons/ButtonCancel';
import { ALL_SIGNALS_QUERY } from '../../pages/signals/index';
import { DrawerFooter } from '../styles/Drawer';
import { FormBodyFull, Label, Row, Form } from '../styles/Card';
import useForm from '../../lib/useForm';
import { perPage } from '../../config';

const CREATE_SIGNAL_MUTATION = gql`
  mutation CREATE_SIGNAL_MUTATION($name: String!) {
    createSignal(data: { name: $name }) {
      id
    }
  }
`;

export default function SignalNew({ open, onClose }) {
  const [createSignal, { loading, error }] = useMutation(
    CREATE_SIGNAL_MUTATION,
    {
      refetchQueries: [
        {
          query: ALL_SIGNALS_QUERY,
          variables: { skip: 0, first: perPage },
        },
      ],
    }
  );
  const { t } = useTranslation('signal');
  const initialValues = useRef({
    name: '',
  });
  const { inputs, handleChange } = useForm(initialValues.current);

  return (
    <Drawer onClose={onClose} open={open} title={t('new-signal')}>
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
            createSignal({ variables: inputs }).catch((err) =>
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

SignalNew.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
