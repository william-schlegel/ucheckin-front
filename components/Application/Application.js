import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import Router from 'next/router';
import Select from 'react-select';

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
  FormTitle,
  RowReadOnly,
  RowFull,
} from '../styles/Card';
import ActionButton from '../Buttons/ActionButton';
import { useUser } from '../User';
import useForm from '../../lib/useForm';
import Badge from '../styles/Badge';
import SearchUser from '../SearchUser';
import ApplicationDelete from './ApplicationDelete';
import ApplicationUpdate from './ApplicationUpdate';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonNew from '../Buttons/ButtonNew';
import { useLicenseName } from '../Tables/LicenseType';
import LicenseTable from '../License/LicenseTable';
import { QUERY_APPLICATION } from './Queries';
import { useHelp, Help, HelpButton } from '../Help';
import LicenseNew from './LicenseNew';
import LicenseUpdate from '../License/LicenseUpdate';
import ApiKey from '../Tables/ApiKey';

export default function Application({ id }) {
  const { loading, error, data } = useQuery(QUERY_APPLICATION, {
    variables: { id },
  });
  const [editOwner, setEditOwner] = useState(false);
  const [editUsers, setEditUsers] = useState(false);
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp(
    'application'
  );

  const { t } = useTranslation('application');
  const { findLicenseName, licenseTypesOptions } = useLicenseName();
  const user = useUser();
  const initialValues = useRef({
    name: '',
    apiKey: '',
    owner: {},
    users: [],
    licenseType: '',
  });
  const { inputs, handleChange, setInputs } = useForm(initialValues.current);
  const [canEdit, setCanEdit] = useState(false);
  const [showAddLicense, setShowAddLicense] = useState(false);
  const [showUpdateLicense, setShowUpdateLicense] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState({});

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
        licenseType: AppData.licenseType.id,
      });
    }
  }, [setInputs, data]);

  function removeUser(idUser) {
    const users = inputs.users.filter((u) => u.key !== idUser);
    setInputs({ ...inputs, users });
  }

  function AddLicense() {
    console.log(`inputs`, inputs);
    if (!inputs.licenseType) return;
    setShowAddLicense(true);
  }

  function updateLicense(licenseId) {
    const license = data.Application.licenses.find((l) => l.id === licenseId);
    console.log(`license`, license);
    setSelectedLicense({
      licenseId,
      appId: id,
      signalId: license.signal.id,
      ownerId: data.Application.owner.id,
    });
    setShowUpdateLicense(true);
  }

  console.log(`inputs.licenseType`, inputs.licenseType);
  console.log(`licenseTypesOptions`, licenseTypesOptions);

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <>
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
      {id && inputs.owner.key && (
        <LicenseNew
          open={showAddLicense}
          onClose={() => setShowAddLicense(false)}
          appId={id}
          ownerId={inputs.owner.key}
        />
      )}
      {selectedLicense.licenseId && (
        <LicenseUpdate
          open={showUpdateLicense}
          onClose={() => setShowUpdateLicense(false)}
          licenseId={selectedLicense.licenseId}
          appId={selectedLicense.appId}
          ownerId={selectedLicense.ownerId}
          signalId={selectedLicense.signalId}
        />
      )}
      <Form>
        <FormHeader>
          <FormTitle>
            {t('application')} <span>{inputs.name}</span>
            <HelpButton showHelp={toggleHelpVisibility} />
          </FormTitle>
          <ButtonBack
            route="/applications"
            label={t('navigation:application')}
          />
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
            <RowReadOnly>
              <Label>{t('common:name')}</Label>
              <span>{inputs.name}</span>
            </RowReadOnly>
          )}
          <RowReadOnly>
            <Label>{t('api-key')}</Label>
            <ApiKey apiKey={inputs.apiKey} showCopied />
          </RowReadOnly>
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
              <Label htmlFor="licenseType">{t('common:license-model')}</Label>
              <Select
                className="select"
                isClearable
                // id="licenseType"
                value={inputs.licenseType}
                onChange={(e) =>
                  handleChange({
                    type: 'select',
                    value: e.value,
                    name: 'licenseType',
                  })
                }
                options={licenseTypesOptions}
              />
            </Row>
          ) : (
            <RowReadOnly>
              <Label>{t('common:license-model')}</Label>
              <span>{findLicenseName(inputs.licenseType)}</span>
            </RowReadOnly>
          )}
          <RowFull>
            <Label>{t('licenses')}</Label>
            <LicenseTable
              licenses={data.Application.licenses}
              actionButtons={[{ type: 'extend', action: updateLicense }]}
            />
            <ButtonNew label={t('add-license')} onClick={AddLicense} />
          </RowFull>
        </FormBody>
        <FormFooter>
          {canEdit && id && (
            <ApplicationUpdate
              id={id}
              updatedApp={inputs}
              onSuccess={() => Router.push('/applications')}
            />
          )}
          {canEdit && id && <ApplicationDelete id={id} />}
          <ButtonCancel onClick={() => Router.back()} />
        </FormFooter>
      </Form>
    </>
  );
}

Application.propTypes = {
  id: PropTypes.string,
};
