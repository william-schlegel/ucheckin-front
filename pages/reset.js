import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import RequestReset from '../components/User/RequestReset';
import Reset from '../components/User/Reset';

export default function ResetPage({ query }) {
  const { t } = useTranslation('user');
  if (!query?.token) {
    return (
      <div>
        <p>{t('reset-token-error')}</p>
        <RequestReset />
      </div>
    );
  }
  return (
    <div>
      <Reset token={query.token} />
    </div>
  );
}

ResetPage.propTypes = {
  query: PropTypes.object,
};
