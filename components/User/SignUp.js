import useTranslation from 'next-translate/useTranslation';
import { useRef } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { UserPlus } from 'react-feather';
import { Form, FormBodyFull, Row, FormFooter, Label } from '../styles/Card';
import useForm from '../../lib/useForm';
import Error from '../ErrorMessage';
import Drawer from '../Drawer';
import { PrimaryButtonStyled } from '../styles/Button';
import { IconButtonStyles } from '../Buttons/ActionButton';
import { CURRENT_USER_QUERY, SIGNUP_MUTATION } from './Queries';

export default function SignUp({ open, onClose }) {
  const { t } = useTranslation('user');
  const initialState = useRef({
    email: '',
    name: '',
    password: '',
    company: '',
  });
  const { inputs, handleChange, resetForm } = useForm(initialState.current);
  const [signup, { error }] = useMutation(SIGNUP_MUTATION, {
    variables: inputs,
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting
    await signup().catch(console.error);
    resetForm();
  }
  return (
    <Drawer onClose={onClose} open={open} title={t('signup')}>
      <Form method="POST" onSubmit={handleSubmit}>
        <Error error={error} />
        <FormBodyFull>
          <Row>
            <Label htmlFor="name" required>
              {t('name')}
            </Label>
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              value={inputs.name}
              onChange={handleChange}
            />
          </Row>
          <Row>
            <Label htmlFor="company" required>
              {t('company')}
            </Label>
            <input
              type="text"
              name="company"
              required
              autoComplete="company"
              value={inputs.company}
              onChange={handleChange}
            />
          </Row>
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
          <Row>
            <Label htmlFor="password" required>
              {t('password')}
            </Label>
            <input
              type="password"
              name="password"
              required
              autoComplete="password"
              value={inputs.password}
              onChange={handleChange}
            />
          </Row>
        </FormBodyFull>
        <FormFooter>
          <PrimaryButtonStyled type="submit">
            <IconButtonStyles>
              <UserPlus size={24} />
            </IconButtonStyles>
            {t('signup')}
          </PrimaryButtonStyled>
        </FormFooter>
      </Form>
    </Drawer>
  );
}

SignUp.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
