import { useMutation, useQuery } from '@apollo/client';
import isEmpty from 'lodash.isempty';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';

import { perPage } from '../../config';
import useAction from '../../lib/useAction';
import useConfirm from '../../lib/useConfirm';
import useForm from '../../lib/useForm';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonDelete from '../Buttons/ButtonDelete';
import ButtonNew from '../Buttons/ButtonNew';
import ButtonValidation from '../Buttons/ButtonValidation';
import DisplayError from '../ErrorMessage';
import FieldError from '../FieldError';
import { Help, HelpButton, useHelp } from '../Help';
import LicenseNew from '../License/LicenseNew';
import LicenseTable from '../License/LicenseTable';
import LicenseUpdate from '../License/LicenseUpdate';
import Loading from '../Loading';
import { SearchUser } from '../SearchUser';
import {
  Block,
  Form,
  FormBody,
  FormFooter,
  FormHeader,
  FormTitle,
  Label,
  Row,
  RowFull,
  RowReadOnly,
} from '../styles/Card';
import selectTheme from '../styles/selectTheme';
import ApiKey from '../Tables/ApiKey';
import { LicenseTypes, useLicenseName } from '../Tables/LicenseType';
import { useUser } from '../User/Queries';
import InvitationNew from './InvitationNew';
import InvitationTable from './InvitationTable';
import {
  ALL_APPLICATIONS_QUERY,
  APPLICATION_QUERY,
  DELETE_APPLICATION_MUTATION,
  DELETE_INVITATION,
  UPDATE_APPLICATION_MUTATION,
} from './Queries';

export default function Application({ id, initialData }) {
  const router = useRouter();
  const { setAction } = useAction();
  const { loading, error, data } = useQuery(APPLICATION_QUERY, {
    variables: { id },
  });
  const [deleteApplication, { loading: loadingDelete, error: errorDelete }] = useMutation(
    DELETE_APPLICATION_MUTATION,
    {
      variables: { id },
      refetchQueries: [
        {
          query: ALL_APPLICATIONS_QUERY,
          variables: { skip: 0, take: perPage },
        },
      ],
      onCompleted: (data) => {
        setAction('delete', 'application', data.deleteApplication.id, data.deleteApplication.name);
        router.push('/applications');
      },
    }
  );
  const [updateApplication, { loading: loadingUpdate, error: errorUpdate }] = useMutation(
    UPDATE_APPLICATION_MUTATION,
    {
      refetchQueries: [
        {
          query: ALL_APPLICATIONS_QUERY,
          variables: { skip: 0, take: perPage },
        },
      ],
      onCompleted: (data) => {
        setAction('update', 'application', data.updateApplication.id);
        router.push('/applications');
      },
    }
  );

  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('application');
  const { user } = useUser();
  const { t } = useTranslation('application');
  const { licenseTypesOptions } = useLicenseName();
  const initialValues = useRef(initialData.data.application);
  const { inputs, handleChange, setInputs, validate, validationError, wasTouched } = useForm(
    initialValues.current,
    ['name', 'licenseTypes']
  );
  const [canEdit, setCanEdit] = useState(false);
  const [showAddLicense, setShowAddLicense] = useState(false);
  const [licenseWithSignal, setLicenseWithSignal] = useState(false);
  const [showUpdateLicense, setShowUpdateLicense] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState({});
  const [showAddInvit, setShowAddInvit] = useState(false);
  const [deleteInvitation, { error: errorDI }] = useMutation(DELETE_INVITATION, {
    onCompleted: (item) => {
      setAction('delete', 'invitation', item.deleteInvitation.id);
      const invitations = inputs.invitations.filter((i) => i.id !== item.deleteInvitation.id);
      setInputs((prev) => ({ ...prev, invitations }));
    },
  });
  const { Confirm, setIsOpen, setArgs } = useConfirm({
    title: t('confirm-delete-invitation'),
    message: t('you-confirm-invitation'),
    yesLabel: t('yes-delete'),
    noLabel: t('no-delete'),
    callback: (args) => deleteInvitation(args),
  });

  const { role: userRole, id: userId } = user;
  const appOwnerId = data?.application?.owner?.id;
  const [licenseTypeChanged, setLicenseTypeChanged] = useState(false);

  useEffect(() => {
    if (userRole) {
      setCanEdit(userRole?.canManageApplication || appOwnerId === userId);
    }
  }, [userRole, userId, appOwnerId]);

  useEffect(() => {
    if (data) {
      setInputs({
        name: data.application.name,
        apiKey: data.application.apiKey,
        owner: {
          id: data.application.owner.id,
          name: data.application.owner.name,
        },
        licenseTypes: data.application.licenseTypes.map((lt) => ({
          id: lt.id,
        })),
        invitations: data.application.invitations,
        licenses: data.application.licenses,
      });
    }
  }, [setInputs, data]);

  function AddLicense() {
    if (!inputs?.licenseTypes.length) return;
    setLicenseWithSignal(false);
    setShowAddLicense(true);
  }

  function AddLicenseSignal() {
    if (!inputs?.licenseTypes.length) return;
    setLicenseWithSignal(true);
    setShowAddLicense(true);
  }

  function updateLicense(licenseId) {
    const license = data.application.licenses.find((l) => l.id === licenseId);
    setSelectedLicense({
      licenseId,
      appId: id,
      signalId: license?.signal?.id,
      ownerId: data.application.owner.id,
    });
    setShowUpdateLicense(true);
  }

  function delInvitation(invitationId) {
    setArgs({ variables: { invitationId } });
    setIsOpen(true);
  }

  function handleDeleteApplication() {
    deleteApplication({ variables: { id } });
  }

  function handleUpdateApplication() {
    const newInputs = validate();
    if (!newInputs) return;
    if (isEmpty(newInputs)) {
      router.push('/applications');
      return;
    }
    if (wasTouched('owner.id')) newInputs.owner = { connect: { id: newInputs.owner.id } };
    if (wasTouched('licenseTypes'))
      newInputs.licenseTypes = {
        set: [],
        connect: inputs.licenseTypes.map((lt) => ({ id: lt.id })),
      };
    const variables = {
      id,
      ...newInputs,
    };
    updateApplication({ variables });
  }

  function handleCloseNewInvitation(newUser) {
    if (newUser.email) {
      const existingUser = inputs.invitations.find((i) => i.email === newUser.email);

      if (!existingUser) {
        const invitations = [...inputs.invitations];
        invitations.push(newUser);
        setInputs({ ...inputs, invitations });
      }
    }
    setShowAddInvit(false);
  }

  function handleCloseNewLicense(orderId) {
    setShowAddLicense(false);
    console.log(`orderId`, orderId);
    router.reload();
    // if (orderId) {
    //   router.push(`/invoice/${orderId}`);
    // }
  }

  if (loading || !user) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (errorDelete) return <DisplayError error={errorDelete} />;
  if (errorUpdate) return <DisplayError error={errorUpdate} />;
  if (errorDI) return <DisplayError error={errorDI} />;

  return (
    <>
      <Head>
        <title>
          UCheck In - {t('application')} {inputs.name}
        </title>
      </Head>
      <Confirm />
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      {id && inputs.owner.id && showAddLicense && (
        <LicenseNew
          open={showAddLicense}
          onClose={handleCloseNewLicense}
          appId={id}
          ownerId={inputs.owner.id}
          withSignal={licenseWithSignal}
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
      {id && <InvitationNew appId={id} open={showAddInvit} onClose={handleCloseNewInvitation} />}
      <Form>
        <FormHeader>
          <FormTitle>
            {t('application')} <span>{inputs.name}</span>
            <HelpButton showHelp={toggleHelpVisibility} />
          </FormTitle>
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
              <FieldError error={validationError.name} />
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
                theme={selectTheme}
                className="select"
                value={inputs.licenseTypes.map((lid) =>
                  licenseTypesOptions.find((lt) => lt.value === lid.id)
                )}
                onChange={(e) => {
                  setLicenseTypeChanged(true);
                  handleChange({
                    value: e.map((lt) => ({ id: lt.value })),
                    name: 'licenseTypes',
                  });
                }}
                options={licenseTypesOptions}
                isMulti
              />
              <FieldError error={validationError.licenseTypes} />
            </Row>
          ) : (
            <RowReadOnly>
              <Label>{t('common:license-model')}</Label>
              <LicenseTypes licenses={inputs.licenseTypes} />
            </RowReadOnly>
          )}
          <Row>
            <Label>{t('invitations')}</Label>
            <InvitationTable
              invitations={inputs.invitations}
              actionButtons={[{ type: 'trash', action: delInvitation }]}
            />
            {canEdit && (
              <Block>
                <ButtonNew onClick={() => setShowAddInvit(true)} />
              </Block>
            )}
          </Row>
          <RowFull>
            <Label>{t('licenses')}</Label>
            <LicenseTable
              licenses={data.application.licenses}
              actionButtons={[{ type: 'extend', action: updateLicense }]}
            />
            <Block>
              <ButtonNew
                label={t('add-license')}
                onClick={AddLicense}
                disabled={licenseTypeChanged}
              />
              <ButtonNew
                label={t('add-license-signal')}
                onClick={AddLicenseSignal}
                disabled={licenseTypeChanged}
              />
            </Block>
          </RowFull>
        </FormBody>
        <FormFooter>
          {canEdit && id && (
            <ButtonValidation disabled={loadingUpdate} onClick={handleUpdateApplication} update />
          )}
          {canEdit && id && (
            <ButtonDelete disabled={loadingDelete} onClick={handleDeleteApplication} />
          )}
          <ButtonCancel onClick={() => router.back()} />
        </FormFooter>
      </Form>
    </>
  );
}

Application.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};
