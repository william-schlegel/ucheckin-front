import { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import Router from 'next/router';
import { Notify } from 'notiflix';
import Select from 'react-select';
import countryList from 'react-select-country-list';

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
import { useUser } from '../User';
import useForm from '../../lib/useForm';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import { useHelp, Help, HelpButton } from '../Help';
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
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('profile');
  const user = useUser();
  const countries = useMemo(() => countryList().getData(), []);
  const initialValues = useRef({
    name: '',
    email: '',
    company: '',
    address: '',
    zipCode: '',
    city: '',
    country: '',
    vatNumber: '',
    telephone: '',
    contact: '',
    role: '',
    photo: {},
  });
  const { inputs, handleChange, setInputs } = useForm(initialValues.current);
  const [photoFile, setPhotoFile] = useState();
  const [canEdit, setCanEdit] = useState(false);

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
        country: UserData.country,
        vatNumber: UserData.vatNumber,
        telephone: UserData.telephone,
        contact: UserData.contact,
        role: UserData.role,
        photo: UserData.photo,
      });
    }
  }, [setInputs, data]);

  function handlePhotoFile(e) {
    setPhotoFile(e.target.files[0]);
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
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
                <Label htmlFor="country">{t('country')}</Label>
                <Select
                  id="country"
                  name="country"
                  options={countries}
                  value={inputs.country}
                  onChange={handleChange}
                />
              </Row>
              <Row>
                <Label htmlFor="vatNumber">{t('vatNumber')}</Label>
                <input
                  type="text"
                  id="vatNumber"
                  name="vatNumber"
                  value={inputs.vatNumber}
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
};
