import { Gift } from 'react-feather';
import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { Notify } from 'notiflix';

import { ButtonStyled } from '../styles/Button';
import {
  ACTIVATE_TRIAL_MUTATION_WITHOUT_SIGNAL,
  ACTIVATE_TRIAL_MUTATION_WITH_SIGNAL,
  ALL_LICENSES_QUERY,
} from '../License/Queries';
import DisplayError from '../ErrorMessage';
import { perPage } from '../../config';
import { useFindApplication } from '../Application/Queries';
import { dateInMonth } from '../DatePicker';
import Loading from '../Loading';

export default function ButtonFreeTrial({
  ownerId,
  appId,
  onSuccess,
  onError,
}) {
  const [
    createTrialWith,
    { error: errorTrialWith, loading: loadingTrialWith },
  ] = useMutation(ACTIVATE_TRIAL_MUTATION_WITH_SIGNAL);
  const [
    createTrialWithout,
    { error: errorTrialWithout, loading: loadingTrialWithout },
  ] = useMutation(ACTIVATE_TRIAL_MUTATION_WITHOUT_SIGNAL);
  const { t } = useTranslation('license');
  const { application } = useFindApplication(appId);

  // trial license is active for 3 months. If the license is per area (like ucheckin) it creates a signal
  async function activateTrial() {
    const variables = {
      ownerId,
      appId,
      licenseTypeId: application.licenseType.id,
      dateValidite: dateInMonth(3),
      trialText: t('trial-text'),
    };
    const refetchQueries = [
      {
        query: ALL_LICENSES_QUERY,
        variables: {
          skip: 0,
          first: perPage,
        },
      },
    ];
    if (application.licenseType.perArea) {
      await createTrialWith({
        variables,
        refetchQueries,
      });
    } else {
      await createTrialWithout({
        variables,
        refetchQueries,
      });
    }
    if (errorTrialWith || errorTrialWithout) {
      Notify.Failure(errorTrialWith.message || errorTrialWithout.message);
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
      {(loadingTrialWith || loadingTrialWithout) && <Loading />}
      {errorTrialWith ||
        (errorTrialWithout && (
          <div>
            <DisplayError error={errorTrialWith || errorTrialWithout} />
          </div>
        ))}
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
