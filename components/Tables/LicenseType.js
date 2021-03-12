import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

export function useLicenseName() {
  const { t } = useTranslation('application');

  function getLicenseName(code) {
    if (code === 'NONE') return t('none');
    if (code === 'UCHECKIN') return 'ucheck-in';
    if (code === 'WIUS') return 'wi-us';
    return t('license-unknown', { code });
  }
  return getLicenseName;
}

export default function LicenseType(props) {
  const { license } = props;
  console.log('LicenseType props', props);
  const getLicenseName = useLicenseName();
  return <span>{getLicenseName(license)}</span>;
}

LicenseType.defaultProps = {
  license: 'NONE',
};

LicenseType.propTypes = {
  license: PropTypes.string,
};
