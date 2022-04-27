import { useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { Play } from 'react-feather';

import useSocket from '../../lib/useSocket';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import { ValidationButtonStyled } from '../styles/Button';
import FormSignalSelection from './FormSignalSelection';
import { UMIX_QUERY } from './Queries';

export default function UmixPlayNow({ open, onClose, id, ownerId }) {
  const { loading, error, data } = useQuery(UMIX_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('umix');
  const { socket } = useSocket();

  function handlePlay(inputs) {
    if (inputs) {
      console.log('inputs', inputs);
      socket.emit('ucheckin-play-now', {
        umixId: id,
        url: inputs.fileNameAtom,
        duration: inputs.duration,
        interval: inputs.interval,
      });
    }
    onClose();
  }

  if (loading) return <Loading />;
  if (!data) return null;

  return (
    <Drawer onClose={onClose} open={open} title={t('play-now')}>
      <FormSignalSelection
        BtnValidation={({ onClick }) => (
          <ValidationButtonStyled onClick={onClick}>
            <Play style={{ color: 'var(--primary)' }} />
            {t('play-now')}
          </ValidationButtonStyled>
        )}
        createAtomFile
        ownerId={ownerId}
        subTitle={data.umix.name}
        onValidate={handlePlay}
        onClose={onClose}
      />

      <DrawerFooter>{error && <DisplayError error={error} />}</DrawerFooter>
    </Drawer>
  );
}

UmixPlayNow.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
