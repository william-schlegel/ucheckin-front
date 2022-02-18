import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { UserPlus } from 'react-feather';
import SwitchComponent from 'react-switch';
import { useToasts } from 'react-toast-notifications';

import useForm from '../../lib/useForm';
import { IconButtonStyles } from '../Buttons/ActionButton';
import Drawer from '../Drawer';
import Error from '../ErrorMessage';
import FieldError from '../FieldError';
import { PrimaryButtonStyled } from '../styles/Button';
import { Form, FormBodyFull, FormFooter, Label, Row, RowReadOnly } from '../styles/Card';
import { CURRENT_USER_QUERY, SIGNUP_MUTATION } from './Queries';

export default function SignUp({ open, onClose }) {
  const { t } = useTranslation('user');
  const initialState = useRef({
    email: '',
    name: '',
    password: '',
    company: '',
    canSeeAppMenu: true,
    canSeeUcheckinMenu: false,
    canSeeUmitMenu: false,
  });
  const { inputs, handleChange, resetForm, validate, validationError } = useForm(
    initialState.current,
    [
      'name',
      'company',
      { field: 'password', check: 'isPassword' },
      { field: 'email', check: 'isEmail' },
    ]
  );
  const { addToast } = useToasts();

  const [signup, { error }] = useMutation(SIGNUP_MUTATION, {
    variables: { data: inputs },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
    onCompleted: (data) => {
      console.log('data', data);
      addToast(t('account-created', { email: data.createUser.email }), {
        appearance: 'success',
        autoDismiss: 30,
      });
    },
  });

  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting
    if (!validate()) return;
    await signup().catch(console.error);
    resetForm();
    onClose();
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
            <FieldError error={validationError.name} />
          </Row>
          <Row>
            <Label htmlFor="company" required>
              {t('company')}
            </Label>
            <input
              type="text"
              name="company"
              required
              autoComplete="organization"
              value={inputs.company}
              onChange={handleChange}
            />
            <FieldError error={validationError.company} />
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
              autoComplete="current-password"
              value={inputs.password}
              onChange={handleChange}
            />
            <FieldError error={validationError.password} />
          </Row>
          <RowReadOnly>
            <Label>{t('app-menu')}</Label>
            <SwitchComponent
              onChange={(value) => handleChange({ name: 'canSeeAppMenu', value })}
              checked={inputs.canSeeAppMenu}
            />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('ucheckin-menu')}</Label>
            <SwitchComponent
              onChange={(value) => handleChange({ name: 'canSeeUcheckinMenu', value })}
              checked={inputs.canSeeUcheckinMenu}
            />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('umit-menu')}</Label>
            <SwitchComponent
              onChange={(value) => handleChange({ name: 'canSeeUmitMenu', value })}
              checked={inputs.canSeeUmitMenu}
            />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('umix-menu')}</Label>
            <SwitchComponent
              onChange={(value) => handleChange({ name: 'canSeeUmixMenu', value })}
              checked={inputs.canSeeUmixMenu}
            />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('hbeacon-menu')}</Label>
            <SwitchComponent
              onChange={(value) => handleChange({ name: 'canSeeHBeaconMenu', value })}
              checked={inputs.canSeeHBeaconMenu}
            />
          </RowReadOnly>
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
