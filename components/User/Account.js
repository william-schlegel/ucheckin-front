import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import { useClipboard } from 'use-clipboard-copy';
import Router, { useRouter } from 'next/router';
import { Notify, Confirm } from 'notiflix';

import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import {
  Form,
  FormBody,
  FormFooter,
  Row,
  Label,
  FormHeader,
  FormTitle,
  Block,
  RowReadOnly,
} from '../styles/Card';
import {
  useUser,
  ADD_TOKEN_MUTATION,
  DELETE_TOKEN_MUTATION,
  QUERY_ACCOUNT,
} from './Queries';
import useForm from '../../lib/useForm';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonNew from '../Buttons/ButtonNew';
import { useHelp, Help, HelpButton } from '../Help';
import Table, { useColumns } from '../Tables/Table';
import { LicenseType, LicenseTypes } from '../Tables/LicenseType';
import ApiKey from '../Tables/ApiKey';
import ValidityDate from '../Tables/ValidityDate';

export default function Account({ id, initialData }) {
  const { t } = useTranslation('user');
  const clipboard = useClipboard({
    copiedTimeout: 1000,
  });
  const clipboardCopied = clipboard.copied;

  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('profile');
  const { user } = useUser();
  const initialValues = useRef(initialData);
  const { inputs, setInputs } = useForm(initialValues.current);
  const [canEdit, setCanEdit] = useState(false);
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
      [
        t('application:status'),
        'status',
        ({ cell: { value } }) => t(`application:${value}`),
      ],
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
      [
        t('validity'),
        'validity',
        ({ cell: { value } }) => <ValidityDate value={value} />,
      ],
    ],
    false
  );

  const { loading, error, data } = useQuery(QUERY_ACCOUNT, {
    variables: { id },
  });
  const [
    addTokenMutation,
    { loading: tokenLoading, error: tokenError },
  ] = useMutation(ADD_TOKEN_MUTATION, {
    variables: { ownerId: id },
    refetchQueries: [{ query: QUERY_ACCOUNT, variables: { id } }],
    onCompleted: (tokenData) => {
      const newToken = tokenData.createToken.token;
      clipboard.copy(newToken);
      Notify.Success(t('token-created', { token: newToken }));
    },
  });
  const [deleteTokenMutation, { error: deleteTokenError }] = useMutation(
    DELETE_TOKEN_MUTATION,
    {
      refetchQueries: [{ query: QUERY_ACCOUNT, variables: { id } }],
      onCompleted: () => {
        Notify.Success(t('token-deleted'));
      },
    }
  );

  const router = useRouter();

  useEffect(() => {
    if (clipboardCopied) Notify.Info(t('common:copied'));
  }, [clipboardCopied, t]);

  useEffect(() => {
    if (data && user) {
      setCanEdit(user.role?.canManageUsers || data.User.id === user.id);
    }
  }, [data, user]);

  useEffect(() => {
    if (data) {
      const { User: UserData } = data;
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
    Confirm.Show(
      t('confirm-delete'),
      t('you-confirm'),
      t('yes-delete'),
      t('no-delete'),
      () =>
        deleteTokenMutation({
          variables: { id: idDel },
        })
    );
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (tokenError) return <DisplayError error={tokenError} />;
  if (deleteTokenError) return <DisplayError error={deleteTokenError} />;
  return (
    <>
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
      <Form>
        <FormHeader>
          <FormTitle>
            {t('profile')} <span>{inputs.name}</span>
            <HelpButton showHelp={toggleHelpVisibility} />
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
              actionButtons={
                canEdit ? [{ type: 'trash', action: deleteToken }] : []
              }
              withPagination
            />
            {/* <Block>
              <ButtonNew onClick={addToken} disabled={tokenLoading} />
              {tokenLoading && <Loading />}
            </Block> */}
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
        </FormBody>
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
