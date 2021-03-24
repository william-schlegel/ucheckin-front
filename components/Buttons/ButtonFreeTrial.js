import { Gift } from 'react-feather';
import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { Notify } from 'notiflix';

import Spinner from '../Spinner';
import { ButtonStyled } from '../styles/Button';
import {
  ACTIVATE_TRIAL_MUTATION,
  ALL_LICENSES_QUERY,
} from '../License/Queries';
import { CREATE_SIGNAL_MUTATION } from '../Signal/Queries';
import DisplayError from '../ErrorMessage';
import { perPage } from '../../config';
import { useFindApplication } from '../Application/Queries';

export default function ButtonFreeTrial({
  ownerId,
  appId,
  onSuccess,
  onError,
}) {
  const [
    createTrial,
    { error: errorTrial, loading: loadingTrial },
  ] = useMutation(ACTIVATE_TRIAL_MUTATION);
  const [
    createSignal,
    { error: errorSignal, loading: loadingSignal },
  ] = useMutation(CREATE_SIGNAL_MUTATION);
  const { t } = useTranslation('license');
  const { application } = useFindApplication(appId);

  // trial license is active for 3 months. If the license is per area (like ucheckin) it creates a signal
  async function activateTrial() {
    const nowPlus3Months = new Date();
    nowPlus3Months.setMonth(nowPlus3Months.getMonth() + 3);
    let signalId;
    if (application.licenseType.perArea) {
      const newSignal = await createSignal({ variables: { ownerId } });
      if (errorSignal) {
        console.log(`errorSignal`, errorSignal);
        Notify.Failure(errorSignal.message);
        onError();
        return;
      }
      Notify.Success(
        t('signal-created', { signal: newSignal.data.createSignal.name })
      );
      signalId = newSignal.data.createSignal.id;
    }
    await createTrial({
      variables: {
        ownerId,
        appId,
        signalId,
        licenseTypeId: application.licenseType.id,
        dateValidite: nowPlus3Months.toISOString(),
        trialText: t('trial-text'),
      },
      refetchQueries: [
        {
          query: ALL_LICENSES_QUERY,
          variables: {
            skip: 0,
            first: perPage,
          },
        },
      ],
    });
    if (errorTrial) {
      console.log(`errorTrial`, errorTrial);
      Notify.Failure(errorTrial.message);
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
      {(loadingTrial || loadingSignal) && <Spinner size={24} />}
      {errorTrial && (
        <div>
          <DisplayError error={errorTrial} />
        </div>
      )}
    </>
  );
}

ButtonFreeTrial.defaultProps = {
  onSuccess: () => {},
  onError: () => {},
};

ButtonFreeTrial.propTypes = {
  ownerId: PropTypes.string.isRequired,
  appId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};
