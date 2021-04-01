import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
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
import useForm from '../../lib/useForm';
import { SearchUser } from '../SearchUser';
import ApplicationUpdate from './ApplicationUpdate';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonNew from '../Buttons/ButtonNew';
import ButtonDelete from '../Buttons/ButtonDelete';
import { LicenseTypes, useLicenseName } from '../Tables/LicenseType';
import LicenseTable from '../License/LicenseTable';
import {
  ALL_APPLICATIONS_QUERY,
  DELETE_APPLICATION_MUTATION,
  APPLICATION_QUERY,
} from './Queries';
import { useHelp, Help, HelpButton } from '../Help';
import LicenseNew from './LicenseNew';
import LicenseUpdate from '../License/LicenseUpdate';
import ApiKey from '../Tables/ApiKey';
import { useUser } from '../User/Queries';
import { perPage } from '../../config';
import InvitationTable from './InvitationTable';
import InvitationNew from './InvitationNew';

export default function Application({ id, initialData }) {
  const { loading, error, data } = useQuery(APPLICATION_QUERY, {
    variables: { id },
  });
  const [
    deleteApplication,
    { loading: loadingDelete, error: errorDelete },
  ] = useMutation(DELETE_APPLICATION_MUTATION, {
    variables: { id },
    refetchQueries: [
      {
        query: ALL_APPLICATIONS_QUERY,
        variables: { skip: 0, first: perPage },
      },
    ],
    onCompleted: () => {
      Router.push('/applications');
    },
  });
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp(
    'application'
  );
  const user = useUser();
  const { t } = useTranslation('application');
  const { licenseTypesOptions } = useLicenseName();
  const initialValues = useRef(initialData.data.Application);
  const { inputs, handleChange, setInputs } = useForm(initialValues.current);
  const [canEdit, setCanEdit] = useState(false);
  const [showAddLicense, setShowAddLicense] = useState(false);
  const [showUpdateLicense, setShowUpdateLicense] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState({});
  const [showAddInvit, setShowAddInvit] = useState(false);

  const { role: userRole, id: userId } = user;
  const appOwnerId = data?.Application?.owner?.id;

  useEffect(() => {
    if (userRole) {
      setCanEdit(userRole?.canManageApplication || appOwnerId === userId);
    }
  }, [userRole, userId, appOwnerId]);

  useEffect(() => {
    if (data) {
      setInputs(data.Application);
    }
  }, [setInputs, data]);

  function AddLicense() {
    if (!inputs?.licenseTypes.length) return;
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

  function handleDeleteApplication() {
    deleteApplication({ variables: { id } });
  }

  function handleCloseNewInvitation(newUser) {
    if (newUser) {
      const existingUser = inputs.invitations.find(
        (i) => i.email === newUser.email
      );

      if (!existingUser) {
        const invitations = [...inputs.invitations];
        invitations.push(newUser);
        console.log(`invitations`, invitations);
        setInputs({ ...inputs, invitations });
      }
    }
    setShowAddInvit(false);
  }

  if (loading || !user) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (errorDelete) return <DisplayError error={errorDelete} />;

  // console.log(`inputs`, inputs);

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
      {id && (
        <InvitationNew
          appId={id}
          open={showAddInvit}
          onClose={handleCloseNewInvitation}
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
          {user.role?.canManageApplication ? (
            <Row>
              <Label>{t('common:owner')}</Label>
              <Block>
                <SearchUser
                  required
                  name="owner.id"
                  value={inputs.owner.id}
                  onChange={handleChange}
                />
              </Block>
            </Row>
          ) : (
            <RowReadOnly>
              <Label>{t('common:owner')}</Label>
              <span>{inputs.owner.name}</span>
            </RowReadOnly>
          )}

          {canEdit ? (
            <Row>
              <Label htmlFor="licenseTypes" required>
                {t('common:license-model')}
              </Label>
              <Select
                className="select"
                required
                value={inputs.licenseTypes.map((lid) =>
                  licenseTypesOptions.find((lt) => lt.value === lid.id)
                )}
                onChange={(e) => {
                  console.log(`e`, e);
                  handleChange({
                    value: e.map((lt) => ({ id: lt.value })),
                    name: 'licenseTypes',
                  });
                }}
                options={licenseTypesOptions}
                isMulti
              />
            </Row>
          ) : (
            <RowReadOnly>
              <Label>{t('common:license-model')}</Label>
              <LicenseTypes licenses={inputs.licenseTypes} />
            </RowReadOnly>
          )}
          <Row>
            <Label>{t('invitations')}</Label>
            <InvitationTable invitations={inputs.invitations} />
            {canEdit && (
              <Block>
                <ButtonNew onClick={() => setShowAddInvit(true)} />
              </Block>
            )}
          </Row>
          <RowFull>
            <Label>{t('licenses')}</Label>
            <LicenseTable
              licenses={data.Application.licenses}
              actionButtons={[{ type: 'extend', action: updateLicense }]}
            />
            <Block>
              <ButtonNew label={t('add-license')} onClick={AddLicense} />
            </Block>
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
          {canEdit && id && (
            <ButtonDelete
              disabled={loadingDelete}
              onClick={handleDeleteApplication}
            />
          )}
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
