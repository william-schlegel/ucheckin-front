import { useRef } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';

import SwitchComponent from 'react-switch';
import Drawer, { DrawerFooter } from '../Drawer';
import ButtonValidation from '../Buttons/ButtonValidation';
import ButtonCancel from '../Buttons/ButtonCancel';
import { FormBodyFull, Label, Row, Form, RowReadOnly } from '../styles/Card';
import useForm from '../../lib/useForm';
import { dateNow } from '../DatePicker';
import FieldError from '../FieldError';

export default function InvitationNew({ appId, open, onClose }) {
  const { t } = useTranslation('application');
  const initialValues = useRef({
    email: '',
    application: { connect: { id: appId } },
    status: 'created',
    user: null,
    updated: dateNow(),
    canModifyApplication: false,
    canManageContent: true,
    canBuyLicenses: false,
  });
  const {
    inputs,
    handleChange,
    validate,
    validationError,
  } = useForm(initialValues.current, { email: 'is-required' });

  function handleNewInvitation() {
    if (validate()) onClose(inputs);
  }

  return (
    <Drawer onClose={onClose} open={open} title={t('new-invitation')}>
      <Form>
        <FormBodyFull>
          <span>{t('help-invite')}</span>
          <Row>
            <Label htmlFor="email" required>
              {t('common:email')}
            </Label>
            <input
              required
              type="text"
              id="email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
            />
            <FieldError error={validationError.email} />
          </Row>
          <RowReadOnly>
            <Label>{t('can-manage-content')}</Label>
            <SwitchComponent
              onChange={(value) =>
                handleChange({ name: 'canManageContent', value })
              }
              checked={inputs.canManageContent}
            />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('can-modify-app')}</Label>
            <SwitchComponent
              onChange={(value) =>
                handleChange({ name: 'canModifyApplication', value })
              }
              checked={inputs.canModifyApplication}
            />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('can-buy-licenses')}</Label>
            <SwitchComponent
              onChange={(value) =>
                handleChange({ name: 'canBuyLicenses', value })
              }
              checked={inputs.canBuyLicenses}
            />
          </RowReadOnly>
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonValidation onClick={handleNewInvitation} />
        <ButtonCancel onClick={onClose} />
      </DrawerFooter>
    </Drawer>
  );
}

InvitationNew.propTypes = {
  appId: PropTypes.string.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
