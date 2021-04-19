import { useRef } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';

import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/dist/client/router';
import {
  CHECK_INVITATION_TOKEN,
  CREATE_ACCOUNT_INVITATION,
  UPDATE_INVITATION,
} from './Queries';
import Loading from '../Loading';
import DisplayError from '../ErrorMessage';
import {
  Form,
  FormBody,
  FormBodyFull,
  FormFooter,
  FormHeader,
  FormTitle,
  H2,
  H3,
  Label,
  Row,
  RowReadOnly,
} from '../styles/Card';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonNew from '../Buttons/ButtonNew';
import ButtonValidation from '../Buttons/ButtonValidation';
import FieldError from '../FieldError';
import useForm from '../../lib/useForm';

export default function AcceptInvitation({ token }) {
  const router = useRouter();
  const { data, loading, error } = useQuery(CHECK_INVITATION_TOKEN, {
    variables: { token },
  });
  const [
    updateInvitationStatus,
    { error: errorUpdate, loading: loadingUpdate },
  ] = useMutation(UPDATE_INVITATION, { onCompleted: () => router.push('/') });
  const [
    createAccountInvitation,
    { error: errorCreate, loading: loadingCreate },
  ] = useMutation(CREATE_ACCOUNT_INVITATION, {
    onCompleted: () => router.push('/login'),
  });
  const { t } = useTranslation('application');
  const invitation = data?.allInvitations[0] || { user: {}, application: {} };
  const initialValues = useRef({ name: '', company: '', password: '' });
  const { inputs, handleChange, validate, validationError } = useForm(
    initialValues.current,
    {
      name: '',
      company: '',
      password: '',
    }
  );

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;

  function handleAcceptInvitation() {
    updateInvitationStatus({ variables: { token, accept: true } });
    console.log('accepted');
  }

  function handleRefuseInvitation() {
    updateInvitationStatus({ variables: { token, accept: false } });
    console.log('refused');
  }

  function handleCreateAccount() {
    if (!validate()) return;
    createAccountInvitation({ variables: { token, ...inputs } });
    console.log('create account');
  }

  if (!invitation.id) return <H2>{t('invalid-token')}</H2>;
  return (
    <Form>
      <FormHeader>
        <FormTitle>{t('accept-invitation')}</FormTitle>
      </FormHeader>
      <FormBodyFull>
        <H2>
          <span>{t('you-are-invited')}</span>
        </H2>
        <RowReadOnly>
          <Label>{t('application')}</Label>
          <span>{invitation.application.name}</span>
        </RowReadOnly>
        {invitation.user?.id ? (
          <RowReadOnly>
            <Label>{t('invited-user')}</Label>
            <span>
              {invitation.user.name} ({invitation.user.email})
            </span>
          </RowReadOnly>
        ) : (
          <>
            <H3>{t('need-account')}</H3>
            <FormBody>
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
              <Row>
                <Label htmlFor="company" required>
                  {t('common:company')}
                </Label>
                <input
                  required
                  type="text"
                  id="company"
                  name="company"
                  value={inputs.company}
                  onChange={handleChange}
                />
                <FieldError error={validationError.company} />
              </Row>
              <Row>
                <Label htmlFor="password" required>
                  {t('common:password')}
                </Label>
                <input
                  required
                  type="password"
                  id="password"
                  name="password"
                  value={inputs.password}
                  onChange={handleChange}
                />
                <FieldError error={validationError.password} />
              </Row>
            </FormBody>
          </>
        )}
      </FormBodyFull>
      <FormFooter>
        {invitation.user?.id ? (
          <ButtonValidation
            disabled={loadingUpdate}
            onClick={handleAcceptInvitation}
            label={t('accept-invitation')}
          />
        ) : (
          <ButtonNew
            onClick={handleCreateAccount}
            label={t('create-account')}
            disabled={loadingCreate}
          />
        )}
        <ButtonCancel
          onClick={handleRefuseInvitation}
          label={t('refuse-invitation')}
          disabled={loadingUpdate || loadingCreate}
        />
        {errorUpdate && (
          <Row>
            <DisplayError error={errorUpdate} />
          </Row>
        )}
        {errorCreate && (
          <Row>
            <DisplayError error={errorCreate} />
          </Row>
        )}
      </FormFooter>
    </Form>
  );
}

AcceptInvitation.propTypes = {
  token: PropTypes.string,
};
