import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';

import useForm from '../../lib/useForm';
import CancelButton from '../Buttons/ButtonCancel';
import ValidationButton from '../Buttons/ButtonValidation';
import DatePicker, { dateNow } from '../DatePicker';
import DisplayError from '../ErrorMessage';
import FieldError from '../FieldError';
import { Form, FormBodyFull, FormFooter, Label, Row, RowReadOnly } from '../styles/Card';
import selectTheme from '../styles/selectTheme';
import { useLicenseName } from '../Tables/LicenseType';
import { CREATE_PLAYLIST_ITEM, UMIX_QUERY } from './Queries';

export const MY_SIGNALS_QUERY = gql`
  query MY_SIGNALS_QUERY($where: SignalWhereInput) {
    signals(where: $where) {
      id
      name
    }
  }
`;

export default function NewPlaylistItem({ ownerId, umixId, onClose }) {
  const { t } = useTranslation('umix');
  const initialValues = useRef({
    playAt: dateNow(),
    signalId: '',
    licenseTypeId: '',
    duration: 60,
  });
  const { inputs, handleChange, validate, validationError } = useForm(initialValues.current, [
    { field: 'duration', check: 'isNotNull' },
    'licenseTypeId',
  ]);
  const [optionsSignals, setOptionsSignals] = useState([]);
  const { data: dataSig, loading: loadingSignal } = useQuery(MY_SIGNALS_QUERY, {
    variables: { where: { owner: { id: { equals: ownerId } } } },
  });
  const [saveItem, { error: errorCreateItem }] = useMutation(CREATE_PLAYLIST_ITEM, {
    onCompleted: () => onClose(),
    refetchQueries: [{ query: UMIX_QUERY, variables: { id: umixId } }],
  });
  const { licenseTypesOptions } = useLicenseName();

  useEffect(() => {
    if (dataSig) {
      setOptionsSignals(dataSig.signals.map((s) => ({ value: s.id, label: s.name })));
    }
  }, [dataSig]);

  function handleSaveFile() {
    const newInputs = validate();

    if (!newInputs) return;
    const variables = {
      data: {
        duration: newInputs.duration || 60,
        playAt: newInputs.playAt,
        signal: newInputs.signalId ? { connect: { id: newInputs.signalId } } : null,
        licenseType: { connect: { id: newInputs.licenseTypeId } },
        umix: { connect: { id: umixId } },
      },
    };
    saveItem({ variables });
  }

  if (loadingSignal) return <div>...</div>;

  return (
    <Form>
      <FormBodyFull>
        <RowReadOnly>
          <Label> {t('play-date')} </Label>
          <DatePicker
            ISOStringValue={inputs.playAt}
            onChange={(dt) =>
              handleChange({
                name: 'playAt',
                value: dt.toISOString(),
              })
            }
            withTime
          />
        </RowReadOnly>
        <Row>
          <Label htmlFor="licenseTypes" required>
            {t('common:license-model')}
          </Label>
          <Select
            id="licenseTypes"
            theme={selectTheme}
            className="select"
            value={licenseTypesOptions.find((n) => n.value === inputs.signalId)}
            onChange={(n) =>
              handleChange({
                name: 'licenseTypeId',
                value: n.value,
              })
            }
            options={licenseTypesOptions}
          />
          <FieldError error={validationError.licenseTypesId} />
        </Row>
        <Row>
          <Label required>{t('common:signal')}</Label>
          <Select
            className="select"
            theme={selectTheme}
            required
            value={optionsSignals.find((n) => n.value === inputs.signalId)}
            onChange={(n) =>
              handleChange({
                name: 'signalId',
                value: n.value,
              })
            }
            options={optionsSignals}
          />
          <FieldError error={validationError['signalId']} />
        </Row>
        <Row>
          <Label htmlFor="duration" required>
            {t('duration')}
          </Label>
          <input
            type="number"
            required
            id="duration"
            name="duration"
            value={inputs.duration}
            onChange={handleChange}
          />
          <FieldError error={validationError['duration']} />
        </Row>
        <FormFooter>
          <ValidationButton onClick={handleSaveFile} />
          <CancelButton onClick={onClose} />
        </FormFooter>
        {errorCreateItem && <DisplayError error={errorCreateItem} />}
      </FormBodyFull>
    </Form>
  );
}
