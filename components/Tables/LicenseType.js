import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const LICENSE_TYPE_QUERY = gql`
  query LICENSE_TYPE_QUERY {
    licenseTypes: allLicenseTypes {
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
  const { data } = useQuery(LICENSE_TYPE_QUERY);
  const [licenseTypes, setLicenseTypes] = useState([]);
  const [licenseTypesOptions, setLicenseTypesOptions] = useState([]);
  const dataLt = data?.licenseTypes.length;

  useEffect(() => {
    if (data) {
      setLicenseTypes(data.licenseTypes);
      setLicenseTypesOptions(
        data.licenseTypes.map((l) => ({ value: l.id, label: t(l.name) }))
      );
    }
  }, [dataLt]);

  function findLicenseType(licenseId) {
    if (!data) return;
    const lt = data.licenseTypes.find((l) => l.id === licenseId);
    if (!data || !licenseId) return;
    if (!lt) return '';
    return lt;
  }

  function findLicenseName(licenseId) {
    const lt = findLicenseType(licenseId);
    if (lt === '') return t('license-unknown', { licenseId });
    if (!data || !licenseId) return t('no-license');
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
    width: 40px;
    max-width: 25%;
    height: auto;
    margin-right: 1rem;
    border-radius: 100px;
  }
`;

export default function LicenseType({ license }) {
  const { findLicenseName, findLicenseType } = useLicenseName();
  const [lt, setLt] = useState({});
  useEffect(() => {
    setLt(findLicenseType(license));
  }, [license, findLicenseType, setLt]);

  return (
    <LicenseStyled>
      <img
        src={!lt?.logo ? '/images/UNKNOWN.png' : lt.logo.publicUrlTransformed}
        alt=""
      />
      {findLicenseName(license)}
    </LicenseStyled>
  );
}

LicenseType.propTypes = {
  license: PropTypes.string,
};
