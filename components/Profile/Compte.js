import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useClipboard } from 'use-clipboard-copy';
import Router, { useRouter } from 'next/router';
import { Notify } from 'notiflix';

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
import { useUser } from '../User';
import useForm from '../../lib/useForm';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonNew from '../Buttons/ButtonNew';
import { useHelp, Help, HelpButton } from '../Help';
import Table, { useColumns } from '../Tables/Table';
import LicenseType from '../Tables/LicenseType';
import ApiKey from '../Tables/ApiKey';

export const QUERY_COMPTE = gql`
  query QUERY_COMPTE($id: ID!) {
    User(where: { id: $id }) {
      id
      name
      company
      applications {
        id
        name
        licenseType {
          id
          name
        }
      }
      ownedApps {
        id
        name
        licenseType {
          id
          name
        }
      }
      tokens {
        id
        token
      }
    }
  }
`;

const ADD_TOKEN_MUTATION = gql`
  mutation ADD_TOKEN_MUTATION($ownerId: ID!) {
    createToken(data: { owner: { connect: { id: $ownerId } } }) {
      id
      token
    }
  }
`;

const DELETE_TOKEN_MUTATION = gql`
  mutation DELETE_TOKEN_MUTATION($id: ID!) {
    deleteToken(id: $id) {
      id
    }
  }
`;

export default function Compte({ id }) {
  const { t } = useTranslation('profile');
  const clipboard = useClipboard({
    copiedTimeout: 1000,
  });
  const clipboardCopied = clipboard.copied;

  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('profile');
  const user = useUser();
  const initialValues = useRef({
    name: '',
    company: '',
    ownedApps: [],
    applications: [],
    tokens: [],
  });
  const { inputs, setInputs } = useForm(initialValues.current);
  const [canEdit, setCanEdit] = useState(false);
  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [t('common:name'), 'name'],
    [
      t('common:license-model'),
      'licenseType.id',
      ({ cell: { value } }) => <LicenseType license={value} />,
    ],
  ]);
  const columnsToken = useColumns([
    ['id', 'id', 'hidden'],
    [t('token'), 'token', ({ cell: { value } }) => <ApiKey apiKey={value} />],
  ]);
  const { loading, error, data } = useQuery(QUERY_COMPTE, {
    variables: { id },
  });
  const [
    addTokenMutation,
    { loading: tokenLoading, error: tokenError },
  ] = useMutation(ADD_TOKEN_MUTATION, {
    variables: { ownerId: id },
    refetchQueries: [{ query: QUERY_COMPTE, variables: { id } }],
    onCompleted: (tokenData) => {
      const newToken = tokenData.createToken.token;
      // const tokens = [...inputs.tokens];
      // tokens.push(tokenData.createToken);
      // setInputs({ ...inputs, tokens: [...inputs.tokens] });
      clipboard.copy(newToken);
      Notify.Success(t('token-created', { token: newToken }));
    },
  });
  const [deleteTokenMutation, { error: deleteTokenError }] = useMutation(
    DELETE_TOKEN_MUTATION,
    {
      refetchQueries: [{ query: QUERY_COMPTE, variables: { id } }],
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
      setCanEdit(user.role.canManageUsers || data.User.id === user.id);
    }
  }, [data, user]);

  useEffect(() => {
    if (data) {
      const { User: UserData } = data;
      setInputs({
        name: UserData.name,
        company: UserData.company,
        ownedApps: UserData.ownedApps,
        applications: UserData.applications,
        tokens: UserData.tokens,
      });
    }
  }, [setInputs, data]);

  function editApplication(appId) {
    router.push(`/application/${appId}`);
  }

  function addToken() {
    addTokenMutation();
  }

  function deleteToken(idDel) {
    deleteTokenMutation({
      variables: { id: idDel },
    });
  }

  // function copyToken(idCopy) {
  //   const token = inputs.tokens.find((tk) => tk.id === idCopy);
  //   clipboard.copy(token.token);
  // }

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
              columns={columns}
              data={inputs.ownedApps}
              loading={loading}
              actionButtons={[{ type: 'edit', action: editApplication }]}
            />
          </Row>
          <Row>
            <Label>{t('invited-apps')}</Label>
            <Table
              columns={columns}
              data={inputs.applications}
              loading={loading}
              actionButtons={[{ type: 'view', action: editApplication }]}
            />
          </Row>
          <Row>
            <Label>{t('tokens')}</Label>
            <Table
              columns={columnsToken}
              data={inputs.tokens}
              loading={loading}
              actionButtons={
                canEdit
                  ? [
                      // { type: 'copy', action: copyToken },
                      { type: 'trash', action: deleteToken },
                    ]
                  : []
              }
            />
            <Block>
              <ButtonNew onClick={addToken} disabled={tokenLoading} />
              {tokenLoading && <Loading />}
            </Block>
          </Row>
        </FormBody>
        <FormFooter>
          <ButtonCancel onClick={() => Router.back()} />
        </FormFooter>
      </Form>
    </>
  );
}

Compte.propTypes = {
  id: PropTypes.string.isRequired,
};
