import { useRef } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';

import Drawer from '../Drawer';
import ButtonValidation from '../Buttons/ButtonValidation';
import ButtonCancel from '../Buttons/ButtonCancel';
import { DrawerFooter } from '../styles/Drawer';
import { FormBodyFull, Label, Row, Form } from '../styles/Card';
import useForm from '../../lib/useForm';
import { dateNow } from '../DatePicker';

export default function InvitationNew({ appId, open, onClose }) {
  const { t } = useTranslation('application');
  const initialValues = useRef({
    email: '',
    appId,
    status: 'created',
    user: null,
    updated: dateNow(),
  });
  const { inputs, handleChange } = useForm(initialValues.current);

  function handleNewInvitation() {
    onClose(inputs);
  }

  return (
    <Drawer onClose={onClose} open={open} title={t('new-invitation')}>
      <Form>
        <FormBodyFull>
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
          </Row>
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
