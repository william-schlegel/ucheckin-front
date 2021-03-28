import { useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';

import Drawer from '../Drawer';
import DisplayError from '../ErrorMessage';
import ButtonValidation from '../Buttons/ButtonValidation';
import ButtonCancel from '../Buttons/ButtonCancel';
import {
  ALL_SIGNALS_QUERY,
  CREATE_SIGNALS_MUTATION,
  PAGINATION_QUERY,
} from './Queries';
import { DrawerFooter } from '../styles/Drawer';
import { FormBodyFull, Label, Row, Form, Block } from '../styles/Card';
import useForm from '../../lib/useForm';
import { perPage } from '../../config';
import { useUser } from '../User/Queries';
import ActionButton from '../Buttons/ActionButton';
import SearchUser from '../SearchUser';

export default function SignalNew({ open, onClose }) {
  const [createSignal, { loading, error }] = useMutation(
    CREATE_SIGNALS_MUTATION,
    {
      refetchQueries: [
        {
          query: ALL_SIGNALS_QUERY,
          variables: { skip: 0, first: perPage },
        },
        { query: PAGINATION_QUERY },
      ],
    }
  );
  const user = useUser();
  const { t } = useTranslation('signal');
  const initialValues = useRef({
    number: 1,
    owner: { key: user.id, value: user.name },
  });
  const { inputs, handleChange } = useForm(initialValues.current);
  const [editOwner, setEditOwner] = useState(false);
  const [errorNumber, setErrorNumber] = useState('');

  function handleSubmit() {
    const { number, owner } = inputs;
    const max = user.role?.canManageSignal ? 100 : 10;
    if (number < 1 || number > max) {
      setErrorNumber(t('error-number', { max }));
      return;
    }
    const signals = [];
    for (let s = 0; s < number; s += 1)
      signals.push({ data: { owner: { connect: { id: owner.key } } } });
    const variables = { data: signals };
    createSignal({ variables }).catch((err) => alert(err.message));
    onClose();
  }

  return (
    <Drawer onClose={onClose} open={open} title={t('new-signal')}>
      <Form>
        <FormBodyFull>
          <Row>
            <Label htmlFor="name" required>
              {t('number')}
            </Label>
            <input
              required
              type="number"
              id="number"
              name="number"
              value={inputs.number}
              onChange={handleChange}
            />
            <DisplayError error={errorNumber} />
          </Row>
          <Row>
            <Label>{t('common:owner')}</Label>
            <Block>
              <span>{inputs.owner.value}</span>
              {user?.role?.canManageApplication && (
                <ActionButton type="edit" cb={() => setEditOwner(!editOwner)} />
              )}
              {user?.role?.canManageSignal && editOwner && (
                <SearchUser
                  required
                  name="owner"
                  value={inputs.owner}
                  onChange={handleChange}
                />
              )}
            </Block>
          </Row>
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonValidation disabled={loading} onClick={handleSubmit} />
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

SignalNew.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
