import { useMutation, useQuery } from '@apollo/client';
import Router, { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useToasts } from 'react-toast-notifications';

import useForm from '../../lib/useForm';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonValidation from '../Buttons/ButtonValidation';
import DisplayError from '../ErrorMessage';
import FieldError from '../FieldError';
import { Help, HelpButton, useHelp } from '../Help';
import Loading from '../Loading';
import { PrimaryButtonStyled } from '../styles/Button';
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
import Avatar from '../Tables/Avatar';
import { UpdatePhoto } from './ProfileUpdate';
import { QUERY_PROFILE, UPDATE_PROFILE_MUTATION, useRole, useUser } from './Queries';

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.updateUser));
}

export default function Profile({ id, initialData }) {
  const { loading, error, data } = useQuery(QUERY_PROFILE, {
    variables: { id },
  });
  const [updateProfile, { loading: loadingUpdate, error: errorUpdate }] =
    useMutation(UPDATE_PROFILE_MUTATION);
  const { t } = useTranslation('user');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('profile');
  const { user } = useUser();
  const countries = useMemo(() => countryList().getData(), []);
  const initialValues = useRef(initialData.data.user);
  const { inputs, handleChange, setInputs, validate, validationError, wasTouched } = useForm(
    initialValues.current,
    ['name', { field: 'email', check: 'isEmail' }, 'company']
  );
  const [photoFile, setPhotoFile] = useState();
  const [canEdit, setCanEdit] = useState(false);
  const router = useRouter();
  const roles = useRole();
  const invoicingModels = [
    { value: 'online', label: t('online') },
    { value: 'invoice', label: t('invoice') },
  ];
  const { addToast } = useToasts();

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

  function handlePhotoFile(e) {
    setPhotoFile(e.target.files[0]);
  }

  function getCountry(ct) {
    return countries.find((c) => c.value === ct);
  }
  function showMyAccount(e) {
    e.preventDefault();
    router.push({
      pathname: `/account/[id]`,
      query: { id },
    });
  }

  async function handleValidation() {
    const newInputs = validate();
    if (!newInputs) return;
    if (wasTouched('role.id')) newInputs.role = { connect: { id: newInputs.role.id } };
    await updateProfile({ variables: { id, ...newInputs }, update });
    if (!errorUpdate) addToast(t('success'), { appearance: 'success', autoDismiss: true });
  }

  if (loading || !roles.length) return <Loading />;
  if (error) return <DisplayError error={error} />;

  return (
    <>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <Form>
        <FormHeader>
          <FormTitle>
            {t('profile')} <span>{inputs.name}</span>
            <HelpButton showHelp={toggleHelpVisibility} />
            <PrimaryButtonStyled role="button" onClick={showMyAccount}>
              {t('account-detail')}
            </PrimaryButtonStyled>
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
                <FieldError error={validationError.name} />
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
                <FieldError error={validationError.email} />
              </Row>
              <Row>
                <Label htmlFor="company" required>
                  {t('company')}
                </Label>
                <input
                  type="text"
                  required
                  id="company"
                  name="company"
                  value={inputs.company || ''}
                  onChange={handleChange}
                />
                <FieldError error={validationError.company} />
              </Row>
              <Row>
                <Label htmlFor="address">{t('address')}</Label>
                <textarea
                  rows="3"
                  id="address"
                  name="address"
                  value={inputs.address || ''}
                  onChange={handleChange}
                />
              </Row>
              <Row>
                <Label htmlFor="zipCode">{t('zip')}</Label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={inputs.zipCode || ''}
                  onChange={handleChange}
                />
              </Row>
              <Row>
                <Label htmlFor="city">{t('city')}</Label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={inputs.city || ''}
                  onChange={handleChange}
                />
              </Row>
              <Row>
                <Label htmlFor="country">{t('country')}</Label>
                <Select
                  theme={selectTheme}
                  className="select"
                  id="country"
                  options={countries}
                  value={getCountry(inputs.country)}
                  onChange={(e) => handleChange({ name: 'country', value: e.value })}
                />
              </Row>
              <Row>
                <Label htmlFor="vatNumber">{t('vatNumber')}</Label>
                <input
                  type="text"
                  id="vatNumber"
                  name="vatNumber"
                  value={inputs.vatNumber || ''}
                  onChange={handleChange}
                />
              </Row>
              <Row>
                <Label htmlFor="telephone">{t('phone')}</Label>
                <input
                  type="text"
                  id="telephone"
                  name="telephone"
                  value={inputs.telephone || ''}
                  onChange={handleChange}
                />
              </Row>
              <Row>
                <Label htmlFor="contact">{t('contact')}</Label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={inputs.contact || ''}
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
          <RowFull>
            <Label htmlFor="photo">{t('photo')}</Label>
            <Block>
              <Avatar src={inputs?.photo?.publicUrlTransformed} alt={inputs.name} />
              <input type="file" id="photo" name="photo" onChange={handlePhotoFile} />
              <UpdatePhoto
                id={id}
                photo={photoFile}
                onSuccess={(newPhoto) => setInputs({ ...inputs, photo: newPhoto })}
              />
            </Block>
          </RowFull>
          {user?.role?.canManageUsers ? (
            <>
              <Row>
                <Label htmlFor="role" required>
                  {t('role')}
                </Label>
                <Select
                  theme={selectTheme}
                  className="select"
                  id="role"
                  value={roles.find((r) => r.value === inputs.role?.id)}
                  options={roles}
                  onChange={(e) => handleChange({ name: 'role.id', value: e.value })}
                />
              </Row>
              <Row>
                <Label htmlFor="invoicing-model">{t('invoicing-model')}</Label>
                <Select
                  theme={selectTheme}
                  className="select"
                  id="invoicing-model"
                  value={invoicingModels.find((r) => r.value === inputs.invoicingModel)}
                  options={invoicingModels}
                  onChange={(e) => handleChange({ name: 'invoicingModel', value: e.value })}
                />
              </Row>
            </>
          ) : (
            <>
              <RowReadOnly>
                <Label>{t('role')}</Label>
                <span>{inputs.role?.name}</span>
              </RowReadOnly>
              <RowReadOnly>
                <Label>{t('invoicing-model')}</Label>
                <span>{inputs.invoicingModel}</span>
              </RowReadOnly>
            </>
          )}
        </FormBody>
        <FormFooter>
          {canEdit && id && (
            <ButtonValidation disabled={loadingUpdate} onClick={handleValidation} update />
          )}
          <ButtonCancel onClick={() => Router.back()} />
        </FormFooter>
      </Form>
    </>
  );
}

Profile.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};
