import { useRef } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import Select from 'react-select';
import { useRouter } from 'next/router';

import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import ButtonValidation from '../Buttons/ButtonValidation';
import ButtonCancel from '../Buttons/ButtonCancel';
import {
  ALL_NOTIFICATIONS_QUERY,
  CREATE_NOTIFICATION_MUTATION,
} from './Queries';
import { FormBodyFull, Label, Row, Form } from '../styles/Card';
import useForm from '../../lib/useForm';
import { perPage } from '../../config';
import selectTheme from '../styles/selectTheme';
import { useNotificationName } from '../Tables/NotificationType';
import FieldError from '../FieldError';

export default function NotificationNew({ open, onClose }) {
  const router = useRouter();
  const [createNotification, { loading, error }] = useMutation(
    CREATE_NOTIFICATION_MUTATION,
    {
      refetchQueries: [
        {
          query: ALL_NOTIFICATIONS_QUERY,
          variables: { skip: 0, take: perPage },
        },
      ],
      onCompleted: (item) => {
        router.push(`/notification/${item.createNotification.id}`);
      },
    }
  );
  const { t } = useTranslation('notification');
  const { notificationTypesOptions } = useNotificationName();
  const initialValues = useRef({
    name: '',
    type: 'simple',
  });
  const {
    inputs,
    handleChange,
    validate,
    validationError,
  } = useForm(initialValues.current, ['name']);

  function handleValidation() {
    if (!validate()) return;
    createNotification({ variables: inputs }).catch((err) =>
      alert(err.message)
    );
    onClose();
  }

  return (
    <Drawer onClose={onClose} open={open} title={t('new-notification')}>
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
            <Label>{t('type')}</Label>
            <Select
              theme={selectTheme}
              className="select"
              required
              value={notificationTypesOptions.find(
                (n) => n.value === inputs.type
              )}
              onChange={(newType) =>
                handleChange({ name: 'type', value: newType.value })
              }
              options={notificationTypesOptions}
            />
          </Row>
          {inputs.type && (
            <Row>
              <span>{t(`${inputs.type}-desc`)}</span>
            </Row>
          )}
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonValidation disabled={loading} onClick={handleValidation} />
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

NotificationNew.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
