import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { useToasts } from 'react-toast-notifications';

import useForm from '../../lib/useForm';
import Error from '../ErrorMessage';
import FieldError from '../FieldError';
import { PrimaryButtonStyled } from '../styles/Button';
import { FormBodyFull, FormFooter, FormHeader, FormTitle, Input, Label, Row } from '../styles/Card';
import Form from '../styles/Form';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($email: String!, $password: String!, $token: String!) {
    redeemUserPasswordResetToken(email: $email, token: $token, password: $password) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const [errPwd, setErrPwd] = useState('');
  const initialState = useRef({
    email: '',
    password: '',
    verifyPassword: '',
  });
  const { inputs, handleChange, resetForm, validate, validationError } = useForm(
    initialState.current,
    [{ field: 'email', check: 'isEmail' }, 'password', 'verifyPassword']
  );
  const { addToast } = useToasts();
  const router = useRouter();
  const [reset, { data, error }] = useMutation(RESET_MUTATION, {
    variables: { email: inputs.email, password: inputs.password, token },
    onCompleted: (data) => {
      if (data?.redeemUserPasswordResetToken === null)
        addToast(t('reset-pwd-success'), {
          appearance: 'success',
          autoDismiss: 30,
        });
      router.push('/login');
    },
  });
  const successfulError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;

  const { t } = useTranslation('user');

  async function handleValidation() {
    const newInputs = validate();
    if (!newInputs) return;
    if (newInputs.password !== newInputs.verifyPassword) {
      setErrPwd(t('reset-err-pwd'));
      return;
    }
    await reset().catch(console.error);
    resetForm();
  }

  return (
    <div style={{ height: '100%', maxWidth: '600px', margin: 'auto' }}>
      <Form>
        <FormHeader>
          <FormTitle>{t('reset-pwd')}</FormTitle>
        </FormHeader>
        <FormBodyFull>
          <Row>
            <Label htmlFor="email" required>
              {t('reset-email')}
            </Label>
            <Input
              type="email"
              name="email"
              required
              placeholder={t('email')}
              autoComplete="email"
              value={inputs.email}
              onChange={handleChange}
            />
            <FieldError error={validationError.email} />
          </Row>
          <Row>
            <Label htmlFor="password" required>
              {t('reset-new-password')}
            </Label>
            <Input
              type="password"
              name="password"
              required
              placeholder={t('password')}
              autoComplete="password"
              value={inputs.password}
              onChange={handleChange}
            />
            <FieldError error={validationError.password} />
          </Row>
          <Row>
            <Label htmlFor="password" required>
              {t('reset-verify-password')}
            </Label>
            <Input
              type="password"
              name="verifyPassword"
              required
              placeholder={t('verify-password')}
              value={inputs.verifyPassword}
              onChange={handleChange}
            />
            <FieldError error={validationError.verifyPassword} />
          </Row>
          <FormFooter>
            <PrimaryButtonStyled type="button" onClick={handleValidation}>
              {t('reset-request')}
            </PrimaryButtonStyled>
            <Error error={error || successfulError || errPwd} />
          </FormFooter>
        </FormBodyFull>
      </Form>
    </div>
  );
}

Reset.propTypes = {
  token: PropTypes.string.isRequired,
};
