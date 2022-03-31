import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import Select from 'react-select';
import { useToasts } from 'react-toast-notifications';

import useForm from '../../lib/useForm';
import AudioPlayer from '../Audio/AudioPlayer';
import CancelButton from '../Buttons/ButtonCancel';
import NewButton from '../Buttons/ButtonNew';
import ValidationButton from '../Buttons/ButtonValidation';
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
import selectTheme from '../styles/selectTheme';
import Chanel, { useChanel } from '../Tables/Chanel';
import Table, { useColumns } from '../Tables/Table';
import { MUTATION_ADD_SIGNAL_FILE, SIGNAL_QUERY } from './Queries';

export default function SignalFiles({ signalId, signalCode, files }) {
  const { t } = useTranslation('signal');
  const { chanelOptions, getChanelName, getChanelFC } = useChanel();
  const [newFile, setNewFile] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [fileData, setFileData] = useState({});
  const [actualFile, setActualFile] = useState({});
  const { addToast } = useToasts();
  const initialValues = useRef({
    chanel: 'CH2',
    duration: 10,
    interval: 300,
    centralFrequency: 18500,
    overlap: 0,
    gain: 80,
  });
  const { inputs, handleChange, setInputs } = useForm(initialValues.current);
  const [createFile] = useMutation(MUTATION_ADD_SIGNAL_FILE, {
    refetchQueries: [{ query: SIGNAL_QUERY, variables: { id: signalId } }],
  });

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    ['url', 'url', 'hidden'],
    [t('chanel'), 'chanel', ({ cell: { value } }) => <Chanel chanel={value} />],
    [t('duration'), 'duration', null, { unit: t('seconds') }],
  ]);

  async function handleSaveFile() {
    const fc = getChanelFC(inputs.chanel);
    const searchString = new URLSearchParams({
      signal: signalCode,
      fc,
      interval: Number(inputs.interval),
      duration: Number(inputs.duration),
      volume: Number(inputs.gain) / 100,
      mode: 0,
    }).toString();
    const res = await fetch(`/api/signal?${searchString}`, { method: 'GET' });
    // console.log(`res`, res);
    const { url, fileName } = await res.json();
    if (res.status === 200) {
      addToast(t('file-created', { fileName }), {
        appearance: 'success',
        autoDismiss: true,
      });
      const variables = {
        variables: {
          signal: signalId,
          ...inputs,
          centralFrequency: fc,
          url,
          fileName,
        },
      };
      // console.log(`variables`, variables);
      createFile(variables);
    } else {
      addToast(res.error || res.statusText, { appearance: 'error' });
    }
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
    const actual = files.find((f) => f.id === id);
    if (actual) {
      // const searchString = new URLSearchParams({
      //   file: actual.fileName,
      // });
      // fetch(`/api/download?${searchString}`, {
      //   method: 'GET',
      // }).then(async (res) => {
      // const data = await res.json();
      // console.log(`data`, data);
      // fetch(data.url, {
      fetch(actual.url, {
        method: 'GET',
      })
        .then((response) => response.blob())
        .then((blob) => {
          // Create blob link to download
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', actual.fileName);
          // Append to html link element page
          document.body.appendChild(link);
          // Start download
          link.click();
          // Clean up and remove the link
          link.parentNode.removeChild(link);
        });
      // });
    }
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
                theme={selectTheme}
                className="select"
                id="chanel"
                value={chanelOptions.find((ch) => ch.value === inputs.chanel)}
                onChange={(e) => handleChange({ value: e.value, name: 'chanel' })}
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
            <RowFull>
              <Label htmlFor="interval">{t('interval')}</Label>
              <Block>
                <input
                  required
                  type="number"
                  id="interval"
                  name="interval"
                  value={inputs.interval}
                  onChange={handleChange}
                />
                <span>{t('miliseconds')}</span>
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
  signalCode: PropTypes.string.isRequired,
  files: PropTypes.array.isRequired,
};
