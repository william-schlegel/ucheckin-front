import { useRef, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
// import styled from 'styled-components';
import useTranslation from 'next-translate/useTranslation';
import { LogIn, UserPlus, XCircle } from 'react-feather';

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
import { CURRENT_USER_QUERY } from '../User';
import Error from '../ErrorMessage';
import {
  BlueButtonStyled,
  ButtonStyled,
  PinkButtonStyled,
} from '../styles/Button';
import { IconButtonStyles } from '../Buttons/ActionButton';
import SignUp from './SignUp';
import RequestReset from './RequestReset';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

// const SigninContainer = styled.div`
//   height: 100%;
//   max-width: 500px;
//   margin: auto;
// `;

export default function SignInForm() {
  const { t } = useTranslation('user');
  const initialState = useRef({
    email: '',
    password: '',
  });
  const { inputs, handleChange, resetForm } = useForm(initialState.current);
  const [signin, { data }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    // refetch the currently logged in user
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
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
          <PinkButtonStyled type="submit">
            <IconButtonStyles>
              <LogIn size={24} />
            </IconButtonStyles>
            {t('signin')}
          </PinkButtonStyled>
          <BlueButtonStyled type="button" onClick={() => setShowSignup(true)}>
            <IconButtonStyles>
              <UserPlus size={24} />
            </IconButtonStyles>
            {t('signup')}
          </BlueButtonStyled>
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
