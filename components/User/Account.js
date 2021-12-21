import { useMutation, useQuery } from '@apollo/client';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { useClipboard } from 'use-clipboard-copy';

import useAction from '../../lib/useAction';
import useConfirm from '../../lib/useConfirm';
import useForm from '../../lib/useForm';
import ActionButton from '../Buttons/ActionButton';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonNew from '../Buttons/ButtonNew';
import DisplayError from '../ErrorMessage';
import { Help, HelpButton, useHelp } from '../Help';
import Loading from '../Loading';
import { PrimaryButtonStyled } from '../styles/Button';
import {
  Block,
  Form,
  FormBody,
  FormBodyFull,
  FormFooter,
  FormHeader,
  FormTitle,
  Label,
  Row,
  RowReadOnly,
} from '../styles/Card';
import ApiKey from '../Tables/ApiKey';
import { LicenseType, LicenseTypes } from '../Tables/LicenseType';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';
import { ADD_TOKEN_MUTATION, DELETE_TOKEN_MUTATION, QUERY_ACCOUNT, useUser } from './Queries';

export default function Account({ id, initialData }) {
  const { t } = useTranslation('user');
  const clipboard = useClipboard({
    copiedTimeout: 1000,
  });
  // const clipboardCopied = clipboard.copied;

  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('profile');
  const { user } = useUser();
  const initialValues = useRef(initialData);
  const { inputs, setInputs } = useForm(initialValues.current);
  const [canEdit, setCanEdit] = useState(false);
  const { addToast } = useToasts();
  const { setAction } = useAction();
  const columnsApplication = useColumns([
    ['id', 'id', 'hidden'],
    [t('common:name'), 'name'],
    [
      t('common:license-model'),
      'licenseTypes',
      ({ cell: { value } }) => <LicenseTypes licenses={value} />,
    ],
  ]);
  const columnsInvitations = useColumns(
    [
      ['id', 'id', 'hidden'],
      [t('application'), 'application.name'],
      [t('application:status'), 'status', ({ cell: { value } }) => t(`application:${value}`)],
      [
        t('application:updated'),
        'updated',
        ({ cell: { value } }) => <ValidityDate value={value} noColor />,
      ],
    ],
    false
  );
  const columnsToken = useColumns([
    ['id', 'id', 'hidden'],
    [t('token'), 'token', ({ cell: { value } }) => <ApiKey apiKey={value} />],
    [t('created-at'), 'createdAt', ({ cell: { value } }) => <ValidityDate value={value} noColor />],
  ]);
  const columnsLicenses = useColumns(
    [
      ['id', 'id', 'hidden'],
      [
        t('license-type'),
        'licenseType.id',
        ({ cell: { value } }) => <LicenseType license={value} />,
      ],
      [t('application'), 'application.name'],
      [t('signal'), 'signal.name'],
      [t('validity'), 'validity', ({ cell: { value } }) => <ValidityDate value={value} />],
    ],
    false
  );

  const { loading, error, data } = useQuery(QUERY_ACCOUNT, {
    variables: { id },
  });
  const [addTokenMutation, { loading: tokenLoading, error: tokenError }] = useMutation(
    ADD_TOKEN_MUTATION,
    {
      variables: { ownerId: id },
      refetchQueries: [{ query: QUERY_ACCOUNT, variables: { id } }],
      onCompleted: (tokenData) => {
        const newToken = tokenData.createToken.token;
        clipboard.copy(newToken);
        addToast(t('token-created', { token: newToken }), {
          appearance: 'success',
          autoDismiss: true,
        });
      },
    }
  );
  const [deleteTokenMutation, { error: deleteTokenError }] = useMutation(DELETE_TOKEN_MUTATION, {
    refetchQueries: [{ query: QUERY_ACCOUNT, variables: { id } }],
    onCompleted: (data) => {
      setAction('delete', 'token', data.deleteToken.token, `for account ${id}`);
      addToast(t('token-deleted'), {
        appearance: 'success',
        autoDismiss: true,
      });
    },
  });

  const router = useRouter();
  const { Confirm, setIsOpen, setArgs } = useConfirm({
    title: t('confirm-delete'),
    message: t('you-confirm'),
    yesLabel: t('yes-delete'),
    noLabel: t('no-delete'),
    callback: (args) => deleteTokenMutation(args),
  });

  // useEffect(() => {
  //   if (clipboardCopied)
  //     addToast(t('common:copied'), {
  //       appearance: 'success',
  //       autoDismiss: true,
  //     });
  // }, [clipboardCopied, t, addToast]);

  useEffect(() => {
    if (data && user) {
      setCanEdit(user.role?.canManageUsers || data.user.id === user.id);
    }
  }, [data, user]);

  useEffect(() => {
    if (data) {
      const { user: UserData } = data;
      setInputs(UserData);
    }
  }, [setInputs, data]);

  function editApplication(appId) {
    router.push(`/application/${appId}`);
  }

  function addToken() {
    addTokenMutation();
  }

  function deleteToken(idDel) {
    setArgs({
      variables: { id: idDel },
    });
    setIsOpen(true);
  }

  function showMyProfile(e) {
    e.preventDefault();
    router.push({
      pathname: `/user/[id]`,
      query: { id },
    });
  }

  function showSettings(e) {
    e.preventDefault();
    router.push({
      pathname: `/settings/[id]`,
      query: { id },
    });
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (tokenError) return <DisplayError error={tokenError} />;
  if (deleteTokenError) return <DisplayError error={deleteTokenError} />;
  return (
    <>
      <Head>
        <title>
          UCheck In - {t('account')} {inputs.name}
        </title>
      </Head>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <Confirm />
      <Form>
        <FormHeader>
          <FormTitle>
            {t('account')} <span>{inputs.name}</span>
            <HelpButton showHelp={toggleHelpVisibility} />
            <PrimaryButtonStyled role="button" onClick={showMyProfile}>
              {t('profile-detail')}
            </PrimaryButtonStyled>
            <PrimaryButtonStyled role="button" onClick={showSettings}>
              <ActionButton type="settings" />
            </PrimaryButtonStyled>
          </FormTitle>
          <ButtonBack route="/" label={t('navigation:home')} />
        </FormHeader>
        <FormBody>
          <RowReadOnly>
            <Label>{t('common:name')}</Label>
            <span>{inputs.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('company')}</Label>
            <span>{inputs.company}</span>
          </RowReadOnly>
        </FormBody>
        <FormBodyFull>
          <Row>
            <Label>{t('owned-apps')}</Label>
            <Table
              columns={columnsApplication}
              data={inputs.ownedApps}
              loading={loading}
              actionButtons={[{ type: 'edit', action: editApplication }]}
              withPagination
            />
          </Row>
          <Row>
            <Label>{t('invitations')}</Label>
            <Table
              columns={columnsInvitations}
              data={inputs.invitations}
              loading={loading}
              withPagination
            />
          </Row>
          <Row>
            <Block>
              <Label>{t('tokens')}</Label>
              <ButtonNew onClick={addToken} disabled={tokenLoading} />
            </Block>
            <Table
              columns={columnsToken}
              data={inputs.tokens}
              loading={loading}
              actionButtons={canEdit ? [{ type: 'trash', action: deleteToken }] : []}
              withPagination
            />
          </Row>
          <Row>
            <Label>{t('licenses')}</Label>
            <Table
              columns={columnsLicenses}
              data={inputs.ownedLicenses}
              loading={loading}
              withPagination
            />
          </Row>
        </FormBodyFull>
        <FormFooter>
          <ButtonCancel onClick={() => Router.back()} />
        </FormFooter>
      </Form>
    </>
  );
}

Account.propTypes = {
  id: PropTypes.string.isRequired,
  initialData: PropTypes.object,
};
