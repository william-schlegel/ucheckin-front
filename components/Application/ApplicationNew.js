import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import Select from 'react-select';

import { perPage } from '../../config';
import useAction from '../../lib/useAction';
import useForm from '../../lib/useForm';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonValidation from '../Buttons/ButtonValidation';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import FieldError from '../FieldError';
import { Form, FormBodyFull, Label, Row } from '../styles/Card';
import selectTheme from '../styles/selectTheme';
import { useLicenseName } from '../Tables/LicenseType';
import { ALL_APPLICATIONS_QUERY, CREATE_APPLICATION_MUTATION } from './Queries';

export default function ApplicationNew({ open, onClose }) {
  const { setAction } = useAction();
  const [createApplication, { loading, error }] = useMutation(CREATE_APPLICATION_MUTATION, {
    refetchQueries: [
      {
        query: ALL_APPLICATIONS_QUERY,
        variables: { skip: 0, take: perPage },
      },
    ],
    onCompleted: (data) => setAction(`create application ${data.createApplication.id}`),
  });
  const { t } = useTranslation('application');
  const initialValues = useRef({
    name: '',
    licenseTypes: [],
  });
  const { inputs, handleChange, validate, validationError } = useForm(initialValues.current, [
    'name',
  ]);
  const { licenseTypesOptions } = useLicenseName();

  function createNewApplication() {
    const newInputs = validate();
    if (!newInputs) return;
    const variables = {
      name: newInputs.name,
      licenseTypes: {
        connect: inputs.licenseTypes.map((lt) => ({ id: lt.id })),
      },
    };
    createApplication({ variables });
    onClose();
  }

  return (
    <Drawer onClose={onClose} open={open} title={t('new-application')}>
      <Form>
        <FormBodyFull>
          <Row>
            <Label htmlFor="name" required>
              {t('common:name')}
            </Label>
            <input
              required
              type="text"
              id="name"
              name="name"
              value={inputs.name}
              onChange={handleChange}
            />
            <FieldError error={validationError.name} />
          </Row>
          <Row>
            <Label htmlFor="licenseTypes" required>
              {t('common:license-model')}
            </Label>
            <Select
              theme={selectTheme}
              className="select"
              value={inputs.licenseTypes.map((lid) =>
                licenseTypesOptions.find((lt) => lt.value === lid.id)
              )}
              onChange={(e) => {
                handleChange({
                  value: e.map((lt) => ({ id: lt.value })),
                  name: 'licenseTypes',
                });
              }}
              options={licenseTypesOptions}
              isMulti
            />
            <FieldError error={validationError.licenseTypes} />
          </Row>
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonValidation disabled={loading} onClick={createNewApplication} />
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

ApplicationNew.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
