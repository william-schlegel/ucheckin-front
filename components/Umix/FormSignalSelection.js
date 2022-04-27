import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { useToasts } from 'react-toast-notifications';

import useForm from '../../lib/useForm';
import ButtonCancel from '../Buttons/ButtonCancel';
import FieldError from '../FieldError';
import Loading from '../Loading';
import {
  Block,
  Form,
  FormBodyFull,
  FormFooter,
  FormHeader,
  FormTitle,
  Label,
  Row,
} from '../styles/Card';
import selectTheme from '../styles/selectTheme';
import { useChanel } from '../Tables/Chanel';
import { useLicenseName } from '../Tables/LicenseType';

const MY_SIGNALS_QUERY = gql`
  query MY_SIGNALS_QUERY($where: SignalWhereInput) {
    signals(where: $where) {
      id
      name
    }
  }
`;

export default function FormSignalSelection({
  subTitle,
  ownerId,
  BtnValidation,
  onValidate,
  createAtomFile,
}) {
  const initialValues = useRef({
    signalId: '',
    licenseTypeId: '',
    duration: 60,
    interval: 300,
    centralFrequency: 18500,
    overlap: 0,
    gain: 80,
  });
  const { inputs, handleChange, validate, validationError } = useForm(initialValues.current, [
    { field: 'duration', check: 'isNotNull' },
    'licenseTypeId',
    'signalId',
    'chanel',
  ]);
  const [optionsSignals, setOptionsSignals] = useState([]);
  const { data: dataSig, loading: loadingSignal } = useQuery(MY_SIGNALS_QUERY, {
    variables: { where: { owner: { id: { equals: ownerId } } } },
  });
  const { licenseTypesOptions } = useLicenseName();
  const { chanelOptions, getChanelFC } = useChanel();
  const { addToast } = useToasts();
  const { t } = useTranslation('umix');

  function handleClick(e) {
    e.preventDefault();
    async function createSignal() {
      const searchString = new URLSearchParams({
        signal: signal.label,
        fc,
        interval: Number(inputs.interval),
        duration: Number(inputs.duration),
        volume: Number(inputs.gain) / 100,
        mode: 0,
        atom: 1,
      }).toString();
      const res = await fetch(`/api/signal?${searchString}`, { method: 'GET' });
      const { fileNameAtom } = await res.json();
      if (res.status === 200) {
        addToast(t('signal:file-created', { fileName: fileNameAtom }), {
          appearance: 'success',
          autoDismiss: true,
        });
        console.log('fileNameAtom', fileNameAtom);
        return fileNameAtom;
      } else {
        addToast(res.error || res.statusText, { appearance: 'error' });
      }
    }

    const newInputs = validate();
    if (!newInputs) return;
    const fc = getChanelFC(inputs.chanel);
    const signal = optionsSignals.find((s) => s.value === inputs.signalId);
    if (createAtomFile) {
      createSignal().then((fileNameAtom) => {
        onValidate({ ...inputs, fc, fileNameAtom });
      });
    } else {
      onValidate({ ...inputs, fc });
    }
  }

  useEffect(() => {
    if (dataSig) {
      setOptionsSignals(dataSig.signals.map((s) => ({ value: s.id, label: s.name })));
    }
  }, [dataSig]);

  if (loadingSignal) return <Loading />;

  return (
    <Form>
      {subTitle && (
        <FormHeader>
          <FormTitle>
            {t('umix')}
            <span>{subTitle}</span>
          </FormTitle>
        </FormHeader>
      )}
      <FormBodyFull>
        <Row>
          <Label htmlFor="licenseTypes" required>
            {t('common:license-model')}
          </Label>
          <Select
            id="licenseTypes"
            theme={selectTheme}
            className="select"
            value={licenseTypesOptions.find((n) => n.value === inputs.licenseTypeId)}
            onChange={(n) =>
              handleChange({
                name: 'licenseTypeId',
                value: n.value,
              })
            }
            options={licenseTypesOptions}
            required
          />
          <FieldError error={validationError['licenseTypeId']} />
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
          <Label htmlFor="chanels" required>
            {t('signal:chanel')}
          </Label>
          <Select
            theme={selectTheme}
            className="select"
            required
            id="chanel"
            value={chanelOptions.find((ch) => ch.value === inputs.chanel)}
            onChange={(e) => handleChange({ value: e.value, name: 'chanel' })}
            options={chanelOptions}
          />
          <FieldError error={validationError['chanel']} />
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
        <Row>
          <Label htmlFor="interval">{t('signal:interval')}</Label>
          <Block>
            <input
              required
              type="number"
              id="interval"
              name="interval"
              value={inputs.interval}
              onChange={handleChange}
            />
            <span>{t('signal:miliseconds')}</span>
          </Block>
        </Row>
        <FormFooter>
          <BtnValidation onClick={handleClick} />
          <ButtonCancel onClick={() => onValidate(null)} />
        </FormFooter>
      </FormBodyFull>
    </Form>
  );
}

FormSignalSelection.propTypes = {
  subTitle: PropTypes.string,
  ownerId: PropTypes.string.isRequired,
  BtnValidation: PropTypes.element.isRequired,
  onValidate: PropTypes.func.isRequired,
  createAtomFile: PropTypes.bool,
};
