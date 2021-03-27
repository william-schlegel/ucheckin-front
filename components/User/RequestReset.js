import { useRef } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { XCircle } from 'react-feather';

import { Form, FormBodyFull, Row, FormFooter, Label } from '../styles/Card';
import useForm from '../../lib/useForm';
import Error from '../ErrorMessage';
import Drawer from '../Drawer';
import { ButtonStyled } from '../styles/Button';
import { IconButtonStyles } from '../Buttons/ActionButton';
import { CURRENT_USER_QUERY } from './Queries';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      code
      message
    }
  }
`;

export default function RequestReset({ open, onClose }) {
  const { t } = useTranslation('user');
  const initialState = useRef({
    email: '',
  });
  const { inputs, handleChange, resetForm } = useForm(initialState);
  const [signup, { data, loading, error }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: inputs,
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );
  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting
    console.log(inputs);
    const res = await signup().catch(console.error);
    console.log(res);
    console.log({ data, loading, error });
    resetForm();
    // Send the email and password to the graphqlAPI
  }
  return (
    <Drawer onClose={onClose} open={open} title={t('reset-password')}>
      <Form method="POST" onSubmit={handleSubmit}>
        <Error error={error} />
        <FormBodyFull>
          {data?.sendUserPasswordResetLink === null && (
            <p>Success! Check your email for a link!</p>
          )}
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
