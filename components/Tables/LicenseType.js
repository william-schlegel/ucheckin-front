import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Image from 'next/image';

export function useLicenseName() {
  const { t } = useTranslation('common');

  function getLicenseName(code) {
    if (code === 'NONE') return t('no-license');
    if (code === 'UCHECKIN') return t('ucheck-in');
    if (code === 'WIUS') return t('wi-us');
    return t('license-unknown', { code });
  }
  return getLicenseName;
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
  const getLicenseName = useLicenseName();
  return (
    <LicenseStyled>
      <img src={`/images/${license}.png`} alt={license} />
      {getLicenseName(license)}
    </LicenseStyled>
  );
}

LicenseType.defaultProps = {
  license: 'NONE',
};

LicenseType.propTypes = {
  license: PropTypes.string,
};
