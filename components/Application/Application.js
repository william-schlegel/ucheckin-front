import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useClipboard } from 'use-clipboard-copy';
import Router from 'next/router';

import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import {
  Block,
  Form,
  FormBody,
  FormFooter,
  Row,
  Label,
  FormHeader,
} from '../styles/Card';
import ActionButton from '../Buttons/ActionButton';
import { useUser } from '../User';
import useForm from '../../lib/useForm';
import { Badge } from '../styles/Table';
import SearchUser from '../SearchUser';
import DatePicker, { formatDate } from '../DatePicker';
import ApplicationDelete from './ApplicationDelete';
import ApplicationUpdate from './ApplicationUpdate';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';

const QUERY_APPLICATION = gql`
  query QUERY_APPLICATION($id: ID!) {
    Application(where: { id: $id }) {
      name
      apiKey
      owner {
        id
        name
      }
      users {
        id
        name
      }
      license
      validity
    }
  }
`;

export default function Application({ id }) {
  const { loading, error, data } = useQuery(QUERY_APPLICATION, {
    variables: { id },
  });
  const [editOwner, setEditOwner] = useState(false);
  const [editUsers, setEditUsers] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const { t } = useTranslation('application');
  const clipboard = useClipboard({
    copiedTimeout: 1000,
  });
  const user = useUser();
  const initialValues = useRef({
    name: '',
    apiKey: '',
    owner: {},
    users: [],
    license: '',
    validity: new Date().toISOString(),
  });
  const { inputs, handleChange, setInputs } = useForm(initialValues.current);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (data && user) {
      setCanEdit(
        user.role.canManageApplication || data.Application.owner === user.id
      );
    }
  }, [data, user]);

  useEffect(() => {
    if (data) {
      const { Application: AppData } = data;
      setInputs({
        name: AppData.name,
        apiKey: AppData.apiKey,
        owner: { key: AppData.owner.id, value: AppData.owner.name },
        users: AppData.users.map((u) => ({ key: u.id, value: u.name })),
        license: AppData.license,
        validity: AppData.validity,
      });
    }
  }, [setInputs, data]);

  function removeUser(idUser) {
    console.log('remove user', idUser);
  }

  function handleDateChange(dt) {
    const isoDate = new Date(dt).toISOString();
    handleChange({
      target: {
        name: 'validity',
        value: isoDate,
        type: 'date',
      },
    });
    setShowDate(false);
    // setInputs({ ...inputs, validity: isoDate });
  }

  function getLicenseName(code) {
    if (code === 'NONE') return t('none');
    if (code === 'UCHECKIN') return 'Ucheck In';
    if (code === 'WIUS') return 'Wi-Us';
    return t('license-unkown', { code });
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <Form>
      <FormHeader>
        <span>
          {t('application')} {inputs.name}
        </span>
        <ButtonBack route="/applications" label={t('navigation:application')} />
      </FormHeader>
      <FormBody>
        {canEdit ? (
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
        ) : (
          <Row>
            <Label>{t('common:name')}</Label>
            <span>{inputs.name}</span>
          </Row>
        )}
        <Row>
          <Label>{t('api-key')}</Label>
          <Block>
            <span>{inputs.apiKey}</span>
            <ActionButton
              type="copy"
              cb={() => clipboard.copy(inputs.apiKey)}
            />
            {clipboard.copied && <span>{t('common:copied')}</span>}
          </Block>
        </Row>
        <Row>
          <Label>{t('common:owner')}</Label>
          <Block>
            <span>{inputs.owner.value}</span>
            {user.role.canManageApplication && (
              <ActionButton type="edit" cb={() => setEditOwner(!editOwner)} />
            )}
            {user.role.canManageApplication && editOwner && (
              <SearchUser
                required
                name="owner"
                value={inputs.owner}
                onChange={handleChange}
              />
            )}
          </Block>
        </Row>
        <Row>
          <Label>{t('common:users')}</Label>
          <Block>
            {inputs.users.map((u) => (
              <Badge key={u.key}>
                <span>{u.value}</span>
                {canEdit && (
                  <ActionButton
                    type="delete"
                    size={20}
                    cb={() => removeUser(u.key)}
                  />
                )}
              </Badge>
            ))}
            {canEdit && (
              <ActionButton type="edit" cb={() => setEditUsers(!editUsers)} />
            )}
          </Block>
          {canEdit && editUsers && (
            <>
              <span>&nbsp;</span>
              <SearchUser
                required
                name="users"
                value={inputs.users}
                onChange={handleChange}
                multiple
              />
            </>
          )}
        </Row>
        {user.role.canManageApplication ? (
          <Row>
            <Label htmlFor="license">{t('licence-model')}</Label>
            <select
              required
              type="text"
              id="license"
              name="license"
              value={inputs.license}
              onChange={handleChange}
            >
              {['NONE', 'UCHECKIN', 'WIUS'].map((l) => (
                <option key={l} value={l}>
                  {getLicenseName(l)}
                </option>
              ))}
            </select>
          </Row>
        ) : (
          <Row>
            <Label>{t('licence-model')}</Label>
            <span>{getLicenseName(inputs.license)}</span>
          </Row>
        )}
        <Row>
          <Label>{t('date-expiration')}</Label>
          <Block>
            <span>{formatDate(inputs.validity)}</span>
            {user.role.canManageApplication && (
              <ActionButton type="date" cb={() => setShowDate(!showDate)} />
            )}
            {user.role.canManageApplication && showDate && (
              <DatePicker
                ISOStringValue={inputs.validity}
                onChange={handleDateChange}
              />
            )}
          </Block>
        </Row>
      </FormBody>
      <FormFooter>
        {canEdit && id && <ApplicationUpdate id={id} updatedApp={inputs} />}
        {canEdit && id && <ApplicationDelete id={id} />}
        <ButtonCancel onClick={() => Router.back()} />
      </FormFooter>
    </Form>
  );
}

Application.propTypes = {
  id: PropTypes.string,
};
