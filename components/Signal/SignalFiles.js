import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  Block,
  Form,
  FormBodyFull,
  FormHeader,
  FormTitle,
  Label,
  RowFull,
  RowReadOnly,
} from '../styles/Card';
import useForm from '../../lib/useForm';
import Table, { useColumns } from '../Tables/Table';
import Chanel, { useChanel } from '../Tables/Chanel';
import NewButton from '../Buttons/ButtonNew';
import ValidationButton from '../Buttons/ButtonValidation';
import { MUTATION_ADD_SIGNAL_FILE, SIGNAL_QUERY } from './Queries';
import CancelButton from '../Buttons/ButtonCancel';
import AudioPlayer from '../Audio/AudioPlayer';

export default function SignalFiles({ signalId, files }) {
  const { t } = useTranslation('signal');
  const { chanelList, getChanelName } = useChanel();
  const [newFile, setNewFile] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [fileData, setFileData] = useState({});
  const initialValues = useRef({
    chanel: 'CH2',
    duration: 30,
    interval: 300,
    centralFrequency: 18500,
    overlap: 0,
    gain: 100,
  });
  const { inputs, handleChange, setInputs } = useForm(initialValues.current);
  const [createFile, { data }] = useMutation(MUTATION_ADD_SIGNAL_FILE, {
    refetchQueries: [{ query: SIGNAL_QUERY, variables: { id: signalId } }],
  });

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [t('chanel'), 'chanel', ({ cell: { value } }) => <Chanel chanel={value} />],
    [t('duration'), 'duration', null, { unit: t('seconds') }],
  ]);

  function handleSaveFile() {
    createFile({ variables: { signal: signalId, ...inputs } });
    console.log('save file', data);
    setNewFile(false);
  }

  function playFile(id) {
    console.log(`play`, id);
    setPlaying(true);
  }

  function downloadFile(id) {
    console.log(`download`, id);
  }

  function duplicateFile(id) {
    const org = files.find((f) => f.id === id);
    if (!org) return null;
    setInputs(org);
    setNewFile(true);
  }

  function viewFile(id) {
    const org = files.find((f) => f.id === id);
    setFileData(org);
    setShowDetails(true);
  }

  console.log(`files`, files);
  return (
    <Form>
      <FormHeader>
        <FormTitle>{t('files')}</FormTitle>
      </FormHeader>
      <FormBodyFull>
        <RowFull>
          <Label>{t('available')}</Label>
          <Table
            columns={columns}
            data={files}
            actionButtons={[
              { type: 'play', action: playFile, value: 'url' },
              { type: 'download', action: downloadFile },
              { type: 'clone', action: duplicateFile },
              { type: 'view', action: viewFile },
            ]}
          />
        </RowFull>
        {playing && (
          <RowFull>
            <AudioPlayer
              trackName="6CE9D"
              audioSrc="./6CE9D.wav"
              onEnded={() => setPlaying(false)}
            />
          </RowFull>
        )}
        <RowFull>
          <Block>
            <NewButton onClick={() => setNewFile(true)} disables={newFile} />
          </Block>
        </RowFull>
        {showDetails && (
          <>
            <RowReadOnly>
              <Label>{t('chanel')}</Label>
              <span>{getChanelName(fileData.chanel)}</span>
            </RowReadOnly>
            <RowReadOnly>
              <Label>{t('duration')}</Label>
              <span>
                {fileData.duration} {t('seconds')}
              </span>
            </RowReadOnly>
            <RowReadOnly>
              <Label>{t('duration')}</Label>
              <span>
                {fileData.duration} {t('seconds')}
              </span>
            </RowReadOnly>
            <RowReadOnly>
              <Label>{t('interval')}</Label>
              <span>
                {fileData.interval} {t('miliseconds')}
              </span>
            </RowReadOnly>
            <RowReadOnly>
              <Label>{t('central-freq')}</Label>
              <span>{fileData.centralFrequency} Hz</span>
            </RowReadOnly>
            <RowReadOnly>
              <Label>{t('overlap')}</Label>
              <span>{fileData.overlap} %</span>
            </RowReadOnly>
            <RowReadOnly>
              <Label>{t('gain')}</Label>
              <span>{fileData.gain} %</span>
            </RowReadOnly>
          </>
        )}
        {newFile && (
          <>
            <RowFull>
              <Label htmlFor="chanels">{t('chanel')}</Label>
              <select
                id="chanel"
                name="chanel"
                value={inputs.chanel}
                onChange={handleChange}
              >
                {chanelList.map((ch) => (
                  <option key={ch} value={ch}>
                    {getChanelName(ch)}
                  </option>
                ))}
              </select>
            </RowFull>
            <RowFull>
              <Label htmlFor="duration">{t('duration')}</Label>
              <Block>
                <input
                  required
                  type="number"
                  id="duration"
                  name="duration"
                  value={inputs.duration}
                  onChange={handleChange}
                />
                <span>{t('seconds')}</span>
              </Block>
            </RowFull>
            <Block>
              <ValidationButton onClick={handleSaveFile} />
              <CancelButton onClick={() => setNewFile(false)} />
            </Block>
          </>
        )}
      </FormBodyFull>
    </Form>
  );
}

SignalFiles.propTypes = {
  signalId: PropTypes.string.isRequired,
  files: PropTypes.array.isRequired,
};
