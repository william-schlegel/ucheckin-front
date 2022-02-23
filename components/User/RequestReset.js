import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { XCircle } from 'react-feather';
import { useToasts } from 'react-toast-notifications';

import useForm from '../../lib/useForm';
import { IconButtonStyles } from '../Buttons/ActionButton';
import Drawer from '../Drawer';
import Error from '../ErrorMessage';
import FieldError from '../FieldError';
import { ButtonStyled } from '../styles/Button';
import { Form, FormBodyFull, FormFooter, Label, Row } from '../styles/Card';
import { CURRENT_USER_QUERY } from './Queries';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email)
  }
`;

export default function RequestReset({ open, onClose }) {
  const { t } = useTranslation('user');
  const initialState = useRef({ email: '' });
  const { addToast } = useToasts();
  const { inputs, handleChange, resetForm, validate, validationError } = useForm(
    initialState.current,
    [{ field: 'email', check: 'isEmail' }]
  );
  const [requestReset, { data, error }] = useMutation(REQUEST_RESET_MUTATION, {
    variables: inputs,
    onCompleted: () => {
      addToast(t('reset-requested', { email: inputs.email }), {
        appearance: 'success',
        autoDismiss: 30,
      });
    },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting
    if (!validate()) return;
    await requestReset().catch(console.error);
    resetForm();
    onClose();
  }
  return (
    <Drawer onClose={onClose} open={open} title={t('reset-password')}>
      <Form method="POST" onSubmit={handleSubmit}>
        <Error error={error} />
        <FormBodyFull>
          {data?.sendUserPasswordResetLink === null && <p>{t('link-success')}</p>}
          <Row>
            <Label htmlFor="email" required>
              {t('email')}
            </Label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={inputs.email}
              onChange={handleChange}
            />
            <FieldError error={validationError.email} />
          </Row>
        </FormBodyFull>
        <FormFooter>
          <ButtonStyled type="submit">
            <IconButtonStyles>
              <XCircle size={24} />
            </IconButtonStyles>
            {t('request-reset')}
          </ButtonStyled>
        </FormFooter>
      </Form>
    </Drawer>
  );
}

RequestReset.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
