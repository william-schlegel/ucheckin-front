import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';

export const ALL_LICENSE_TYPE_QUERY = gql`
  query ALL_LICENSE_TYPE_QUERY {
    licenseTypes {
      id
      name
      logo {
        publicUrlTransformed(transformation: { width: "100", height: "100" })
      }
    }
  }
`;

export const LICENSE_TYPE_QUERY = gql`
  query LICENSE_TYPE_QUERY($id: ID!) {
    licenseType(where: { id: $id }) {
      id
      name
      logo {
        publicUrlTransformed(transformation: { width: "100", height: "100" })
      }
    }
  }
`;

export function useLicenseName() {
  const { t } = useTranslation('common');
  const { data, loading, error } = useQuery(ALL_LICENSE_TYPE_QUERY);
  const [licenseTypes, setLicenseTypes] = useState([]);
  const [licenseTypesOptions, setLicenseTypesOptions] = useState([]);

  useEffect(() => {
    if (!loading && !error && data) {
      setLicenseTypes(data.licenseTypes);
      setLicenseTypesOptions(
        data.licenseTypes.map((l) => ({ value: l.id, label: t(l.name) }))
      );
    }
  }, [loading, error]);

  function findLicenseType(licenseId) {
    const lt = licenseTypes.find((l) => l.id === licenseId);
    return lt || '';
  }

  function findLicenseName(licenseId) {
    if (!licenseId) return t('no-license');
    const lt = findLicenseType(licenseId);
    if (lt === '') return t('license-unknown', { licenseId });
    return t(lt.name);
  }
  return {
    findLicenseName,
    findLicenseType,
    licenseTypes,
    licenseTypesOptions,
  };
}

const LicenseStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  margin: 0 0.5rem 0 1rem;
  img {
    height: 30px;
    width: auto;
    /* max-width: 25%; */
    margin-right: 1rem;
    border-radius: 100px;
  }
`;

const LicensesStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  align-items: center;
  justify-content: start;
  margin: 0;
  gap: 5px;
  > * {
    border: 1px solid var(--light-grey);
    padding: 5px;
    border-radius: 5px;
    margin: 0;
  }
`;

export function LicenseType({ license, children }) {
  const { data, loading, error } = useQuery(LICENSE_TYPE_QUERY, {
    variables: { id: license },
  });
  const { t } = useTranslation('common');

  if (loading) return <Loading />;
  if (error) return <DisplayError errpr={error} />;
  if (!data) return null;
  return (
    <LicenseStyled>
      <img
        src={
          !data.licenseType?.logo
            ? '/images/UNKNOWN.png'
            : data.licenseType.logo.publicUrlTransformed
        }
        alt=""
      />
      <span>{t(data.licenseType.name)}</span>
      {children}
    </LicenseStyled>
  );
}

LicenseType.propTypes = {
  license: PropTypes.string,
  children: PropTypes.node,
};

export function LicenseTypes({ licenses }) {
  return (
    <LicensesStyled>
      {licenses.map((license) => (
        <LicenseType key={license.id} license={license.id} />
      ))}
    </LicensesStyled>
  );
}

LicenseTypes.propTypes = {
  licenses: PropTypes.array,
};
