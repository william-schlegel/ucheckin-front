import { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import Router, { useRouter } from 'next/router';
import { Notify } from 'notiflix';
import Select from 'react-select';
import countryList from 'react-select-country-list';

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
import { useUser, QUERY_PROFILE, useRole } from './Queries';
import useForm from '../../lib/useForm';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import { useHelp, Help, HelpButton } from '../Help';
import { UpdateProfile, UpdatePhoto } from './ProfileUpdate';
import { PrimaryButtonStyled } from '../styles/Button';

import Avatar from '../Tables/Avatar';

export default function Profile({ id, initialData }) {
  const { loading, error, data } = useQuery(QUERY_PROFILE, {
    variables: { id },
  });
  const { t } = useTranslation('user');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('profile');
  const user = useUser();
  const countries = useMemo(() => countryList().getData(), []);
  const initialValues = useRef(initialData);
  const { inputs, handleChange, setInputs } = useForm(initialValues.current);
  const [photoFile, setPhotoFile] = useState();
  const [canEdit, setCanEdit] = useState(false);
  const router = useRouter();
  const roles = useRole();

  useEffect(() => {
    if (data && user) {
      setCanEdit(user.role?.canManageUsers || data.User.id === user.id);
    }
  }, [data, user]);

  useEffect(() => {
    if (data) {
      const { User: UserData } = data;
      setInputs({ ...UserData, role: UserData.role.id });
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

  if (loading || !roles.length) return <Loading />;
  if (error) return <DisplayError error={error} />;
  console.log(`roles`, roles);
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
                <Label htmlFor="company" required>
                  {t('company')}
                </Label>
                <input
                  type="text"
                  required
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
                  className="select"
                  id="country"
                  options={countries}
                  value={getCountry(inputs.country)}
                  onChange={(e) =>
                    handleChange({ name: 'country', value: e.value })
                  }
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
          {user?.role?.canManageUsers ? (
            <Row>
              <Label htmlFor="role" required>
                {t('role')}
              </Label>
              <Select
                className="select"
                id="role"
                value={roles.find((r) => r.value === inputs.role)}
                options={roles}
                onChange={(e) => handleChange({ name: 'role', value: e.value })}
              />
            </Row>
          ) : (
            <RowReadOnly>
              <Label>{t('role')}</Label>
              <span>{inputs.role?.label}</span>
            </RowReadOnly>
          )}
        </FormBody>
        <FormFooter>
          {canEdit && id && (
            <UpdateProfile
              id={id}
              updatedProfile={inputs}
              onSuccess={() => {
                Notify.Success(t('success'));
              }}
            />
          )}
          <ButtonCancel onClick={() => Router.back()} />
        </FormFooter>
      </Form>
    </>
  );
}

Profile.propTypes = {
  id: PropTypes.string.isRequired,
  initialData: PropTypes.object,
};
