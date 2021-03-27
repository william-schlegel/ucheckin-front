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
import useForm from '../../lib/useForm';
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
import { useUser } from '../User/Queries';

export default function Application({ id, initialData }) {
  const { loading, error, data } = useQuery(QUERY_APPLICATION, {
    variables: { id },
  });
  const [editOwner, setEditOwner] = useState(false);
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp(
    'application'
  );
  const user = useUser();
  const { t } = useTranslation('application');
  const { findLicenseName } = useLicenseName();
  const initialValues = useRef(initialData.data.Application);
  const { inputs, handleChange, setInputs } = useForm(initialValues.current);
  const [canEdit, setCanEdit] = useState(false);
  const [showAddLicense, setShowAddLicense] = useState(false);
  const [showUpdateLicense, setShowUpdateLicense] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState({});
  const licenseTypesOptions = initialData.data.licenseTypes.map((lt) => ({
    value: lt.id,
    label: t(`common:${lt.name}`),
  }));
  console.log(`licenseTypesOptions`, licenseTypesOptions);
  console.log(`inputs.licenseType.id`, inputs.licenseType.id);
  useEffect(() => {
    if (data && user) {
      setCanEdit(
        user.role?.canManageApplication || data.Application.owner === user.id
      );
    }
  }, [data, user]);

  useEffect(() => {
    if (data) {
      const { Application: AppData } = data;
      setInputs(AppData);
    }
  }, [setInputs, data]);

  function AddLicense() {
    if (!inputs.licenseType.id) return;
    setShowAddLicense(true);
  }

  function updateLicense(licenseId) {
    const license = data.Application.licenses.find((l) => l.id === licenseId);
    setSelectedLicense({
      licenseId,
      appId: id,
      signalId: license.signal.id,
      ownerId: data.Application.owner.id,
    });
    setShowUpdateLicense(true);
  }

  if (loading || !user) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <>
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
      {id && inputs.owner.id && (
        <LicenseNew
          open={showAddLicense}
          onClose={() => setShowAddLicense(false)}
          appId={id}
          ownerId={inputs.owner.id}
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
              <span>{inputs.owner.name}</span>
              {user.role.canManageApplication && (
                <ActionButton type="edit" cb={() => setEditOwner(!editOwner)} />
              )}
              {user.role.canManageApplication && editOwner && (
                <SearchUser
                  required
                  name="owner.id"
                  value={inputs.owner.id}
                  onChange={handleChange}
                />
              )}
            </Block>
          </Row>
          <Row>
            <Label htmlFor="users">{t('common:users')}</Label>
            <Block>
              <SearchUser
                id="users"
                name="users"
                value={inputs.users.map((u) => ({
                  value: u.id,
                  label: u.name,
                }))}
                onChange={handleChange}
                multiple
              />
            </Block>
          </Row>
          {user.role.canManageApplication ? (
            <Row>
              <Label htmlFor="licenseType">{t('common:license-model')}</Label>
              <Select
                className="select"
                value={{
                  value: inputs.licenseType.id,
                  label: inputs.licenseType.name,
                }}
                onChange={(e) =>
                  handleChange({
                    value: e.value,
                    name: 'licenseType.id',
                  })
                }
                options={licenseTypesOptions}
              />
            </Row>
          ) : (
            <RowReadOnly>
              <Label>{t('common:license-model')}</Label>
              <span>{findLicenseName(inputs.licenseType.id)}</span>
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
  initialData: PropTypes.object,
};
