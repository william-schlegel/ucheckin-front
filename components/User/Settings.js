import { useMutation, useQuery } from '@apollo/client';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import SwitchComponent from 'react-switch';
import { useToasts } from 'react-toast-notifications';

import useAction from '../../lib/useAction';
import useForm from '../../lib/useForm';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonValidation from '../Buttons/ButtonValidation';
import DisplayError from '../ErrorMessage';
import { Help, HelpButton, useHelp } from '../Help';
import Loading from '../Loading';
import { PrimaryButtonStyled } from '../styles/Button';
import {
  Form,
  FormBody,
  FormFooter,
  FormHeader,
  FormTitle,
  Label,
  RowReadOnly,
} from '../styles/Card';
import { QUERY_SETTINGS, UPDATE_SETTINGS_MUTATION, useRole } from './Queries';

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.updateUser));
}

export default function Profile({ id, initialData }) {
  const { loading, error, data } = useQuery(QUERY_SETTINGS, {
    variables: { id },
  });
  const { setAction } = useAction();
  const [updateProfile, { loading: loadingUpdate, error: errorUpdate }] = useMutation(
    UPDATE_SETTINGS_MUTATION,
    {
      onCompleted: () => setAction('update', 'user', id, 'settings'),
    }
  );
  const { t } = useTranslation('user');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('profile');
  const initialValues = useRef(initialData.data.user);
  const { inputs, handleChange, setInputs, validate } = useForm(initialValues.current);
  const router = useRouter();
  const roles = useRole();
  const { addToast } = useToasts();

  useEffect(() => {
    if (data) {
      const { user: UserData } = data;
      setInputs(UserData);
    }
  }, [setInputs, data]);

  function showMyAccount(e) {
    e.preventDefault();
    router.push({
      pathname: `/account/[id]`,
      query: { id },
    });
  }

  function showMyProfile(e) {
    e.preventDefault();
    router.push({
      pathname: `/user/[id]`,
      query: { id },
    });
  }

  async function handleValidation() {
    const newInputs = validate();
    if (!newInputs) return;
    await updateProfile({ variables: { id, ...newInputs }, update });
    if (!errorUpdate) addToast(t('success'), { appearance: 'success', autoDismiss: true });
  }

  if (loading || !roles.length) return <Loading />;
  if (error) return <DisplayError error={error} />;

  return (
    <>
      <Head>
        <title>
          UCheck In - {t('display-options')} {inputs.name}
        </title>
      </Head>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <Form>
        <FormHeader>
          <FormTitle>
            {t('display-options')} <span>{inputs.name}</span>
            <HelpButton showHelp={toggleHelpVisibility} />
            <PrimaryButtonStyled role="button" onClick={showMyAccount}>
              {t('account-detail')}
            </PrimaryButtonStyled>
            <PrimaryButtonStyled role="button" onClick={showMyProfile}>
              {t('profile-detail')}
            </PrimaryButtonStyled>
          </FormTitle>
          <ButtonBack route="/" label={t('navigation:home')} />
        </FormHeader>
        <FormBody>
          <RowReadOnly>
            <Label>{t('umit-menu')}</Label>
            <SwitchComponent
              onChange={(value) => handleChange({ name: 'canSeeUmitMenu', value })}
              checked={inputs.canSeeUmitMenu}
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
            <Label>{t('app-menu')}</Label>
            <SwitchComponent
              onChange={(value) => handleChange({ name: 'canSeeAppMenu', value })}
              checked={inputs.canSeeAppMenu}
            />
          </RowReadOnly>
        </FormBody>
        <FormFooter>
          {id && <ButtonValidation disabled={loadingUpdate} onClick={handleValidation} update />}
          <ButtonCancel onClick={() => Router.back()} />
        </FormFooter>
      </Form>
    </>
  );
}

Profile.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};
