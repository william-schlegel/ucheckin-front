import { useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import { LogIn, UserPlus, XCircle } from 'react-feather';

import { useRouter } from 'next/router';
import {
  Form,
  FormHeader,
  FormTitle,
  FormBodyFull,
  Row,
  FormFooter,
  Label,
} from '../styles/Card';
import useForm from '../../lib/useForm';
import { CURRENT_USER_QUERY, SIGNIN_MUTATION } from './Queries';
import Error from '../ErrorMessage';
import {
  PrimaryButtonStyled,
  ButtonStyled,
  SecondaryButtonStyled,
} from '../styles/Button';
import { IconButtonStyles } from '../Buttons/ActionButton';
import SignUp from './SignUp';
import RequestReset from './RequestReset';

export default function SignInForm() {
  const { t } = useTranslation('user');
  const router = useRouter();
  const initialState = useRef({
    email: '',
    password: '',
  });
  const { inputs, handleChange, resetForm } = useForm(initialState.current);
  const [signin, { data }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    // refetch the currently logged in user
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
    onCompleted: () => router.push('/'),
  });
  const [showSignUp, setShowSignup] = useState(false);
  const [showReset, setShowReset] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting
    await signin();
    resetForm();
    // Send the email and password to the graphqlAPI
  }
  const error =
    data?.authenticateUserWithPassword.__typename ===
    'UserAuthenticationWithPasswordFailure'
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
            <Label htmlFor="email">
              {t('email')}
              <input
                type="email"
                name="email"
                placeholder="email@company.com"
                autoComplete="email"
                value={inputs.email}
                onChange={handleChange}
              />
            </Label>
          </Row>
          <Row>
            <Label htmlFor="password">
              {t('password')}
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="password"
                value={inputs.password}
                onChange={handleChange}
              />
            </Label>
          </Row>
        </FormBodyFull>
        <FormFooter>
          <SecondaryButtonStyled type="submit">
            <IconButtonStyles>
              <LogIn size={24} />
            </IconButtonStyles>
            {t('signin')}
          </SecondaryButtonStyled>
          <PrimaryButtonStyled
            type="button"
            onClick={() => setShowSignup(true)}
          >
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
