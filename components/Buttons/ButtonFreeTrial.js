import { Gift } from 'react-feather';
import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useToasts } from 'react-toast-notifications';

import { ButtonStyled } from '../styles/Button';
import { CREATE_TRIAL_LICENSE } from '../License/Queries';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import {
  ALL_APPLICATIONS_QUERY,
  APPLICATION_QUERY,
} from '../Application/Queries';
import { perPage } from '../../config';

export default function ButtonFreeTrial({
  ownerId,
  appId,
  onSuccess,
  onError,
}) {
  const [
    createTrial,
    { error: errorTrial, loading: loadingTrial },
  ] = useMutation(CREATE_TRIAL_LICENSE, {
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
  });
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
