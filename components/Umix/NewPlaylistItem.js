import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';

import useSocket from '../../lib/useSocket';
import ValidationButton from '../Buttons/ButtonValidation';
import DatePicker, { dateNow } from '../DatePicker';
import DisplayError from '../ErrorMessage';
import { Form, FormBodyFull, Label, RowReadOnly } from '../styles/Card';
import FormSignalSelection from './FormSignalSelection';
import { CREATE_PLAYLIST_ITEM, UMIX_QUERY } from './Queries';

export default function NewPlaylistItem({ ownerId, umixId, onClose }) {
  const { t } = useTranslation('umix');
  const [playAt, setPlayAt] = useState(dateNow());
  const { socket, isConnected } = useSocket();
  const [saveItem, { error: errorCreateItem }] = useMutation(CREATE_PLAYLIST_ITEM, {
    onCompleted: () => {
      if (isConnected) socket.emit('ucheckin-add-playlist', umixId);
      onClose();
    },
    refetchQueries: [{ query: UMIX_QUERY, variables: { id: umixId } }],
  });
  function handleSaveFile(inputs) {
    if (inputs) {
      console.log('inputs', inputs);
      const variables = {
        data: {
          duration: inputs.duration || 60,
          playAt,
          signal: inputs.signalId ? { connect: { id: inputs.signalId } } : null,
          licenseType: { connect: { id: inputs.licenseTypeId } },
          umix: { connect: { id: umixId } },
          chanel: inputs.chanel,
          centralFrequency: inputs.fc,
          overlap: inputs.overlap,
          gain: inputs.gain,
        },
      };
      saveItem({ variables });
    }
    onClose();
  }

  return (
    <>
      <Form>
        <FormBodyFull>
          <RowReadOnly>
            <Label> {t('play-date')} </Label>
            <DatePicker
              ISOStringValue={playAt}
              onChange={(dt) => setPlayAt(dt.toISOString())}
              withTime
            />
          </RowReadOnly>
          {errorCreateItem && <DisplayError error={errorCreateItem} />}
        </FormBodyFull>
      </Form>
      <FormSignalSelection
        BtnValidation={({ onClick }) => <ValidationButton onClick={onClick} />}
        createAtomFile
        ownerId={ownerId}
        onValidate={handleSaveFile}
      />
    </>
  );
}
