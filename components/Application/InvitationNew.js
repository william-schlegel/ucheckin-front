import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import SwitchComponent from 'react-switch';

import useAction from '../../lib/useAction';
import useForm from '../../lib/useForm';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonValidation from '../Buttons/ButtonValidation';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import FieldError from '../FieldError';
import { Form, FormBodyFull, Label, Row, RowReadOnly } from '../styles/Card';
import { CREATE_INVITATION_MUTATION } from './Queries';

export default function InvitationNew({ appId, open, onClose }) {
  const { t } = useTranslation('application');
  const { setAction } = useAction();
  const [addInvitation, { loading, error }] = useMutation(CREATE_INVITATION_MUTATION, {
    onCompleted: (item) => {
      setAction(`create invitation ${item.addInvitation.id}`);
      onClose(item.addInvitation);
    },
  });
  const initialValues = useRef({
    email: '',
    canModifyApplication: false,
    canManageContent: true,
    canBuyLicenses: false,
  });
  const { inputs, handleChange, validate, validationError } = useForm(initialValues.current, [
    { field: 'email', check: 'isEmail' },
  ]);

  function handleNewInvitation() {
    if (!validate()) return;
    addInvitation({ variables: { appId, ...inputs } });
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
              onChange={(value) => handleChange({ name: 'canManageContent', value })}
              checked={inputs.canManageContent}
            />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('can-modify-app')}</Label>
            <SwitchComponent
              onChange={(value) => handleChange({ name: 'canModifyApplication', value })}
              checked={inputs.canModifyApplication}
            />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('can-buy-licenses')}</Label>
            <SwitchComponent
              onChange={(value) => handleChange({ name: 'canBuyLicenses', value })}
              checked={inputs.canBuyLicenses}
            />
          </RowReadOnly>
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonValidation onClick={handleNewInvitation} disabled={loading} />
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

InvitationNew.propTypes = {
  appId: PropTypes.string.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
