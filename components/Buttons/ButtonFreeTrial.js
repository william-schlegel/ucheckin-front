import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { Gift } from 'react-feather';
import { useToasts } from 'react-toast-notifications';

import { perPage } from '../../config';
import useAction from '../../lib/useAction';
import { ALL_APPLICATIONS_QUERY, APPLICATION_QUERY } from '../Application/Queries';
import DisplayError from '../ErrorMessage';
import { CREATE_TRIAL_LICENSE } from '../License/Queries';
import Loading from '../Loading';
import { ButtonStyled } from '../styles/Button';

export default function ButtonFreeTrial({ ownerId, appId, onSuccess, onError }) {
  const { setAction } = useAction();
  const [createTrial, { error: errorTrial, loading: loadingTrial }] = useMutation(
    CREATE_TRIAL_LICENSE,
    {
      refetchQueries: [
        {
          query: APPLICATION_QUERY,
          variables: { id: appId },
        },
        {
          query: ALL_APPLICATIONS_QUERY,
          variables: { skip: 0, take: perPage },
        },
      ],
      onCompleted: () => setAction(`create trial for app ${appId}`),
    }
  );
  const { t } = useTranslation('license');
  const { addToast } = useToasts();

  // trial license is active for 3 months. If the license is per area (like ucheckin) it creates a signal
  async function activateTrial() {
    await createTrial({
      variables: { appId, ownerId, trialText: t('trial-text') },
    });
    if (errorTrial) {
      addToast(errorTrial.message, { appearance: 'error' });
      onError();
      return;
    }
    onSuccess();
  }

  return (
    <>
      <ButtonStyled onClick={activateTrial}>
        <Gift />
        <span>{t('activate-trial')}</span>
      </ButtonStyled>
      {loadingTrial && <Loading />}
      {errorTrial && (
        <div>
          <DisplayError error={errorTrial} />
        </div>
      )}
    </>
  );
}

ButtonFreeTrial.propTypes = {
  ownerId: PropTypes.string.isRequired,
  appId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};
