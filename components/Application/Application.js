import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import Select from 'react-select';
import { Confirm } from 'notiflix';
import isEmpty from 'lodash.isempty';

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
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonNew from '../Buttons/ButtonNew';
import ButtonDelete from '../Buttons/ButtonDelete';
import ButtonValidation from '../Buttons/ButtonValidation';
import { LicenseTypes, useLicenseName } from '../Tables/LicenseType';
import LicenseTable from '../License/LicenseTable';
import {
  ALL_APPLICATIONS_QUERY,
  DELETE_APPLICATION_MUTATION,
  APPLICATION_QUERY,
  UPDATE_APPLICATION_MUTATION,
  DELETE_INVITATION,
} from './Queries';
import { useHelp, Help, HelpButton } from '../Help';
import LicenseNew from '../License/LicenseNew';
import LicenseUpdate from '../License/LicenseUpdate';
import ApiKey from '../Tables/ApiKey';
import { useUser } from '../User/Queries';
import { perPage } from '../../config';
import InvitationTable from './InvitationTable';
import InvitationNew from './InvitationNew';
import FieldError from '../FieldError';
import selectTheme from '../styles/selectTheme';

export default function Application({ id, initialData }) {
  const router = useRouter();
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
      router.push('/applications');
    },
  });
  const [
    updateApplication,
    { loading: loadingUpdate, error: errorUpdate },
  ] = useMutation(UPDATE_APPLICATION_MUTATION, {
    refetchQueries: [
      {
        query: ALL_APPLICATIONS_QUERY,
        variables: { skip: 0, first: perPage },
      },
    ],
    onCompleted: () => {
      router.push('/applications');
    },
  });

  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp(
    'application'
  );
  const { user } = useUser();
  const { t } = useTranslation('application');
  const { licenseTypesOptions } = useLicenseName();
  const initialValues = useRef(initialData.data.Application);
  const {
    inputs,
    handleChange,
    setInputs,
    validate,
    validationError,
    wasTouched,
  } = useForm(initialValues.current, ['name', 'licenseTypes']);
  const [canEdit, setCanEdit] = useState(false);
  const [showAddLicense, setShowAddLicense] = useState(false);
  const [showUpdateLicense, setShowUpdateLicense] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState({});
  const [showAddInvit, setShowAddInvit] = useState(false);
  const [deleteInvitation, { error: errorDI }] = useMutation(
    DELETE_INVITATION,
    {
      onCompleted: (item) => {
        const invitations = inputs.invitations.filter(
          (i) => i.id !== item.deleteInvitation.id
        );
        setInputs((prev) => ({ ...prev, invitations }));
      },
    }
  );

  const { role: userRole, id: userId } = user;
  const appOwnerId = data?.Application?.owner?.id;

  useEffect(() => {
    if (userRole) {
      setCanEdit(userRole?.canManageApplication || appOwnerId === userId);
    }
  }, [userRole, userId, appOwnerId]);

  useEffect(() => {
    if (data) {
      // console.log(`data.Application`, data.Application);
      setInputs({
        name: data.Application.name,
        apiKey: data.Application.apiKey,
        owner: {
          id: data.Application.owner.id,
          name: data.Application.owner.name,
        },
        licenseTypes: data.Application.licenseTypes.map((lt) => ({
          id: lt.id,
        })),
        invitations: data.Application.invitations,
        licenses: data.Application.licenses,
      });
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
      signalId: license?.signal?.id,
      ownerId: data.Application.owner.id,
    });
    setShowUpdateLicense(true);
  }

  function delInvitation(invitationId) {
    Confirm.Show(
      t('confirm-delete-invitation'),
      t('you-confirm-invitation'),
      t('yes-delete'),
      t('no-delete'),
      () => deleteInvitation({ variables: { invitationId } })
    );
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
    if (wasTouched('owner.id'))
      newInputs.owner = { connect: { id: newInputs.owner.id } };
    if (wasTouched('licenseTypes'))
      newInputs.licenseTypes = {
        disconnectAll: true,
        connect: inputs.licenseTypes.map((lt) => ({ id: lt.id })),
      };
    const variables = {
      id,
      ...newInputs,
      // apiKey: inputs.apiKey,
      // name: inputs.name,
      // owner: { id: inputs.owner.id },
      // licenseTypes: inputs.licenseTypes.map((lt) => ({ id: lt.id })),
    };
    updateApplication({ variables });
  }

  function handleCloseNewInvitation(newUser) {
    console.log(`newUser`, newUser);
    if (newUser.email) {
      const existingUser = inputs.invitations.find(
        (i) => i.email === newUser.email
      );

      if (!existingUser) {
        const invitations = [...inputs.invitations];
        invitations.push(newUser);
        // console.log(`invitations`, invitations);
        setInputs({ ...inputs, invitations });
      }
    }
    setShowAddInvit(false);
  }

  function handleCloseNewLicense(orderId) {
    // console.log(`orderId`, orderId);
    setShowAddLicense(false);
    if (orderId) {
      router.push(`/order/${orderId}`);
    }
  }

  if (loading || !user) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (errorDelete) return <DisplayError error={errorDelete} />;
  if (errorUpdate) return <DisplayError error={errorUpdate} />;
  if (errorDI) return <DisplayError error={errorDI} />;

  // console.log(`licenseTypesOptions`, licenseTypesOptions);
  console.log(`inputs`, inputs);

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
          onClose={handleCloseNewLicense}
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
                  // console.log(`e`, e);
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
            <ButtonValidation
              disabled={loadingUpdate}
              onClick={handleUpdateApplication}
              update
            />
          )}
          {canEdit && id && (
            <ButtonDelete
              disabled={loadingDelete}
              onClick={handleDeleteApplication}
            />
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
