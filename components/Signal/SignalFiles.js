import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import Select from 'react-select';

import {
  Block,
  Form,
  FormBodyFull,
  FormFooter,
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
  const { chanelOptions, getChanelName } = useChanel();
  const [newFile, setNewFile] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [fileData, setFileData] = useState({});
  const [actualFile, setActualFile] = useState({});
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
    ['url', 'url', 'hidden'],
    [t('chanel'), 'chanel', ({ cell: { value } }) => <Chanel chanel={value} />],
    [t('duration'), 'duration', null, { unit: t('seconds') }],
  ]);

  function handleSaveFile() {
    createFile({ variables: { signal: signalId, ...inputs } });
    setNewFile(false);
  }

  function playFile(id) {
    const actual = files.find((f) => f.id === id);
    if (actual) {
      setActualFile(actual);
      setPlaying(true);
    }
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
            withPagination
            actionButtons={[
              { type: 'play', action: playFile },
              { type: 'download', action: downloadFile },
              { type: 'clone', action: duplicateFile },
              { type: 'view', action: viewFile },
            ]}
          />
        </RowFull>
        {playing && (
          <RowFull>
            <AudioPlayer
              trackName={getChanelName(actualFile.chanel)}
              audioSrc={actualFile.url}
              onEnded={() => setPlaying(false)}
              onDownloadClick={() => downloadFile(actualFile.id)}
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
              <Select
                className="select"
                id="chanel"
                value={chanelOptions.find((ch) => ch.value === inputs.chanel)}
                onChange={(e) =>
                  handleChange({ value: e.value, name: 'chanel' })
                }
                options={chanelOptions}
              />
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
            <FormFooter>
              <ValidationButton onClick={handleSaveFile} />
              <CancelButton onClick={() => setNewFile(false)} />
            </FormFooter>
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
