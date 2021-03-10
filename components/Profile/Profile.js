import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useClipboard } from 'use-clipboard-copy';
import Router, { useRouter } from 'next/router';
import { Notify } from 'notiflix';

import styled from 'styled-components';
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
  RowFull,
  Block,
  RowReadOnly,
} from '../styles/Card';
import ActionButton from '../Buttons/ActionButton';
import { useUser } from '../User';
import useForm from '../../lib/useForm';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonNew from '../Buttons/ButtonNew';
import Modale from '../Modale';
import Table, { useColumns } from '../Table';
import { UpdateProfile, UpdatePhoto } from './ProfileUpdate';

export const QUERY_PROFILE = gql`
  query QUERY_PROFILE($id: ID!) {
    User(where: { id: $id }) {
      id
      email
      name
      company
      address
      zipCode
      city
      telephone
      contact
      photo {
        publicUrlTransformed(transformation: { width: "200", height: "200" })
      }
      applications {
        id
        name
        license
      }
      ownedApps {
        id
        name
        license
      }
      role {
        id
        name
      }
      tokens {
        id
        token
      }
      role {
        id
        name
      }
    }
  }
`;

const Avatar = styled.img`
  width: 150px;
  height: auto;
  border-radius: 75px;
`;

export default function Profile({ id }) {
  const { loading, error, data } = useQuery(QUERY_PROFILE, {
    variables: { id },
  });
  const { t } = useTranslation('profile');
  const user = useUser();
  const initialValues = useRef({
    name: '',
    email: '',
    company: '',
    address: '',
    zipCode: '',
    city: '',
    telephone: '',
    contact: '',
    ownedApps: [],
    applications: [],
    tokens: [],
    role: '',
    photo: {},
  });
  const { inputs, handleChange, setInputs } = useForm(initialValues.current);
  const [photoFile, setPhotoFile] = useState();
  const [canEdit, setCanEdit] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const columns = useColumns([
    ['id', 'id', { ui: 'hidden' }],
    [t('common:name'), 'name'],
    [t('application:licence-model'), 'license', { ui: 'license' }],
  ]);
  const columnsToken = useColumns([
    ['id', 'id', { ui: 'hidden' }],
    [t('token'), 'token'],
  ]);
  const clipboard = useClipboard({
    copiedTimeout: 1000,
  });

  const router = useRouter();

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
        email: UserData.email,
        company: UserData.company,
        address: UserData.address,
        zipCode: UserData.zipCode,
        city: UserData.city,
        telephone: UserData.telephone,
        contact: UserData.contact,
        ownedApps: UserData.ownedApps,
        applications: UserData.applications,
        tokens: UserData.tokens,
        role: UserData.role,
        photo: UserData.photo,
      });
    }
  }, [setInputs, data]);

  function editApplication(appId) {
    router.push(`/application/${appId}`);
  }

  function addToken() {
    console.log('add token');
  }

  function deleteToken(idDel) {
    console.log('delete token', idDel);
  }

  function copyToken(idCopy) {
    console.log('id', idCopy);
    console.log('inputs.tokens', inputs.tokens);
    const token = inputs.tokens.find((tk) => tk.id === id);
    console.log('token', token);
    clipboard.copy(token.token);
  }

  function handlePhotoFile(e) {
    setPhotoFile(e.target.files[0]);
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <>
      <Modale
        isOpen={helpOpen}
        setIsOpen={setHelpOpen}
        title={t('help-title')}
        cancelLabel={t('common:ok')}
      >
        <p>{t('help-text')}</p>
      </Modale>
      <Form>
        <FormHeader>
          <FormTitle>
            {t('profile')} <span>{inputs.name}</span>
            <ActionButton
              type="help"
              label={t('common:help')}
              cb={() => setHelpOpen(true)}
            />
          </FormTitle>
          <ButtonBack route="/" label={t('navigation:home')} />
        </FormHeader>
        <FormBody>
          {canEdit ? (
            <>
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
              </Row>
              <Row>
                <Label htmlFor="email" required>
                  {t('common:email')}
                </Label>
                <input
                  required
                  type="text"
                  id="email"
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
                />
              </Row>
              <Row>
                <Label htmlFor="company">{t('company')}</Label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={inputs.company}
                  onChange={handleChange}
                />
              </Row>
              <Row>
                <Label htmlFor="address">{t('address')}</Label>
                <textarea
                  rows="3"
                  id="address"
                  name="address"
                  value={inputs.address}
                  onChange={handleChange}
                />
              </Row>
              <Row>
                <Label htmlFor="zipCode">{t('zip')}</Label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={inputs.zipCode}
                  onChange={handleChange}
                />
              </Row>
              <Row>
                <Label htmlFor="city">{t('city')}</Label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={inputs.city}
                  onChange={handleChange}
                />
              </Row>
              <Row>
                <Label htmlFor="telephone">{t('phone')}</Label>
                <input
                  type="text"
                  id="telephone"
                  name="telephone"
                  value={inputs.telephone}
                  onChange={handleChange}
                />
              </Row>
              <Row>
                <Label htmlFor="contact">{t('contact')}</Label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={inputs.contact}
                  onChange={handleChange}
                />
              </Row>
            </>
          ) : (
            <>
              <RowReadOnly>
                <Label>{t('common:name')}</Label>
                <span>{inputs.name}</span>
              </RowReadOnly>
              <RowReadOnly>
                <Label>{t('common:email')}</Label>
                <span>{inputs.email}</span>
              </RowReadOnly>
              <RowReadOnly>
                <Label>{t('company')}</Label>
                <span>{inputs.company}</span>
              </RowReadOnly>
              <RowReadOnly>
                <Label>{t('address')}</Label>
                <span>{inputs.address}</span>
              </RowReadOnly>
              <RowReadOnly>
                <Label>{t('zip')}</Label>
                <span>{inputs.zip}</span>
              </RowReadOnly>
              <RowReadOnly>
                <Label>{t('city')}</Label>
                <span>{inputs.city}</span>
              </RowReadOnly>
              <RowReadOnly>
                <Label>{t('phone')}</Label>
                <span>{inputs.telephone}</span>
              </RowReadOnly>
              <RowReadOnly>
                <Label>{t('contact')}</Label>
                <span>{inputs.contact}</span>
              </RowReadOnly>
            </>
          )}
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
          <RowFull>
            <Label htmlFor="photo">{t('photo')}</Label>
            <Block>
              <Avatar
                src={inputs?.photo?.publicUrlTransformed}
                alt={inputs.name}
              />
              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handlePhotoFile}
              />
              <UpdatePhoto
                id={id}
                photo={photoFile}
                onSuccess={(newPhoto) =>
                  setInputs({ ...inputs, photo: newPhoto })
                }
              />
            </Block>
          </RowFull>

          <RowReadOnly>
            <Label>{t('role')}</Label>
            <span>{inputs.role.name}</span>
          </RowReadOnly>

          <Row>
            <Label>{t('tokens')}</Label>
            <Table
              columns={columnsToken}
              data={inputs.tokens}
              loading={loading}
              actionButtons={
                canEdit
                  ? [
                      { type: 'copy', action: copyToken },
                      { type: 'trash', action: deleteToken },
                    ]
                  : []
              }
            />
            {clipboard.copied && <div>{t('common:copied')}</div>}
            <Block>
              <ButtonNew onClick={addToken} />
            </Block>
          </Row>
        </FormBody>
        <FormFooter>
          {canEdit && id && (
            <UpdateProfile
              id={id}
              updatedProfile={inputs}
              onSuccess={() => {
                Notify.Success(t('success'), {
                  position: 'center-bottom',
                  fontSize: '20px',
                });
              }}
            />
          )}
          {/* {canEdit && id && <ApplicationDelete id={id} />} */}
          <ButtonCancel onClick={() => Router.back()} />
        </FormFooter>
      </Form>
    </>
  );
}

Profile.propTypes = {
  id: PropTypes.string,
};
