import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
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
import { useNotificationName } from '../Tables/NotificationType';
import { useUser } from '../User/Queries';
import { QUERY_APP_FROM_USER, QUERY_SIGNAL_FROM_APP } from './Notification';
import { ALL_NOTIFICATIONS_QUERY, CREATE_NOTIFICATION_MUTATION } from './Queries';

export default function NotificationNew({ open, onClose }) {
  const router = useRouter();
  const { setAction } = useAction();
  const [createNotification, { loading, error }] = useMutation(CREATE_NOTIFICATION_MUTATION, {
    refetchQueries: [
      {
        query: ALL_NOTIFICATIONS_QUERY,
        variables: { skip: 0, take: perPage },
      },
    ],
    onCompleted: (item) => {
      setAction('create', 'notification item', item.createNotification.id);
      router.push(`/notification/${item.createNotification.id}`);
    },
  });
  const { t } = useTranslation('notification');
  const { notificationTypesOptions } = useNotificationName();
  const initialValues = useRef({
    name: '',
    type: 'simple',
    appId: '',
    signalId: '',
  });
  const { inputs, handleChange, validate, validationError } = useForm(initialValues.current, [
    'name',
    'appId',
    'signalId',
  ]);
  const [queryAppUser, { data: dataApp }] = useLazyQuery(QUERY_APP_FROM_USER);
  const [querySignal, { data: dataSig }] = useLazyQuery(QUERY_SIGNAL_FROM_APP);
  const [optionsAppUser, setOptionsAppUser] = useState([]);
  const [optionsSignals, setOptionsSignals] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    queryAppUser({ variables: { user: user.id } });
    setOptionsSignals([]);
  }, [user, queryAppUser]);

  useEffect(() => {
    if (dataApp?.applications) {
      setOptionsAppUser(dataApp.applications.map((d) => ({ value: d.id, label: d.name })));
      setOptionsSignals([]);
    }
  }, [dataApp, setOptionsAppUser]);

  function handleChangeApp(app) {
    handleChange({
      name: 'appId',
      value: app?.value,
    });
    if (app?.value) {
      querySignal({ variables: { appId: app.value } });
    }
  }

  useEffect(() => {
    if (dataSig?.signals) {
      setOptionsSignals(dataSig.signals.map((d) => ({ value: d.id, label: d.name })));
    }
  }, [dataSig, setOptionsSignals]);

  function handleValidation() {
    if (!validate()) return;
    createNotification({
      variables: {
        name: inputs.name,
        type: inputs.type,
        application: { connect: { id: inputs.appId } },
        signal: { connect: { id: inputs.signalId } },
      },
    }).catch((err) => alert(err.message));
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
              value={notificationTypesOptions.find((n) => n.value === inputs.type)}
              onChange={(newType) => handleChange({ name: 'type', value: newType.value })}
              options={notificationTypesOptions}
            />
          </Row>
          {inputs.type && (
            <Row>
              <span>{t(`${inputs.type}-desc`)}</span>
            </Row>
          )}
          <Row>
            <Label required>{t('application')}</Label>
            <Select
              theme={selectTheme}
              className="select"
              required
              value={optionsAppUser.find((n) => n.value === inputs.applicationId)}
              onChange={(sel) => handleChangeApp(sel)}
              options={optionsAppUser}
            />
            <FieldError error={validationError['applicationId']} />
          </Row>
          <Row>
            <Label required>{t('signal')}</Label>
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
          </Row>
          <FieldError error={validationError['signalId']} />
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
