import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { useRef, useState } from 'react';
import { LogIn, UserPlus, XCircle } from 'react-feather';

import useAction from '../../lib/useAction';
import useForm from '../../lib/useForm';
import { IconButtonStyles } from '../Buttons/ActionButton';
import Error from '../ErrorMessage';
import FieldError from '../FieldError';
import { ButtonStyled, PrimaryButtonStyled, SecondaryButtonStyled } from '../styles/Button';
import { Form, FormBodyFull, FormFooter, FormHeader, FormTitle, Label, Row } from '../styles/Card';
import { CURRENT_USER_QUERY, SIGNIN_MUTATION } from './Queries';
import RequestReset from './RequestReset';
import SignUp from './SignUp';

export default function SignInForm() {
  const { t } = useTranslation('user');
  const router = useRouter();
  const initialState = useRef({
    email: '',
    password: '',
  });
  const { inputs, handleChange, resetForm, validate, validationError } = useForm(
    initialState.current,
    [{ field: 'email', check: 'isEmail' }, 'password']
  );
  const { setAction } = useAction();

  const [signin, { data }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    // refetch the currently logged in user
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
    onCompleted: (data) => {
      setAction(
        'login',
        'login',
        data?.authenticateUserWithPassword?.item?.id,
        navigator?.userAgent,
        data?.authenticateUserWithPassword?.item?.id
      );
      setTimeout(() => router.push('/'), 1000);
    },
  });
  const [showSignUp, setShowSignup] = useState(false);
  const [showReset, setShowReset] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting
    if (!validate()) return;
    await signin();
    resetForm();
    // Send the email and password to the graphqlAPI
  }
  const error =
    data?.authenticateUserWithPassword.__typename === 'UserAuthenticationWithPasswordFailure'
      ? data?.authenticateUserWithPassword
      : undefined;

  return (
    <div style={{ height: '100%', maxWidth: '600px', margin: 'auto' }}>
      <SignUp open={showSignUp} onClose={() => setShowSignup(false)} />
      <RequestReset open={showReset} onClose={() => setShowReset(false)} />
      <Form method="POST" onSubmit={handleSubmit}>
        <FormHeader>
          <FormTitle>{t('signin-account')}</FormTitle>
        </FormHeader>
        <FormBodyFull>
          <Error error={error} />
          <Row>
            <Label htmlFor="email" required>
              {t('email')}
            </Label>
            <input
              type="email"
              name="email"
              required
              placeholder="email@company.com"
              autoComplete="email"
              value={inputs.email}
              onChange={handleChange}
            />
            <FieldError error={validationError.email} />
          </Row>
          <Row>
            <Label htmlFor="password" required>
              {t('password')}
            </Label>
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              autoComplete="current-password"
              value={inputs.password}
              onChange={handleChange}
            />
            <FieldError error={validationError.password} />
          </Row>
        </FormBodyFull>
        <FormFooter>
          <SecondaryButtonStyled type="submit">
            <IconButtonStyles>
              <LogIn size={24} />
            </IconButtonStyles>
            {t('signin')}
          </SecondaryButtonStyled>
          <PrimaryButtonStyled type="button" onClick={() => setShowSignup(true)}>
            <IconButtonStyles>
              <UserPlus size={24} />
            </IconButtonStyles>
            {t('signup')}
          </PrimaryButtonStyled>
          <ButtonStyled type="button" onClick={() => setShowReset(true)}>
            <IconButtonStyles>
              <XCircle size={24} />
            </IconButtonStyles>
            {t('reset-password')}
          </ButtonStyled>
        </FormFooter>
      </Form>
    </div>
  );
}
