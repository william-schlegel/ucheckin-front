import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import SwitchComponent from 'react-switch';

import { perPage } from '../../config';
import useAction from '../../lib/useAction';
import useForm from '../../lib/useForm';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonValidation from '../Buttons/ButtonValidation';
import DatePicker, { dateDay, dateInMonth } from '../DatePicker';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import { TableStyled } from '../License/LicensePrice';
import { SearchUsers } from '../SearchUser';
import SegmentedControl from '../SegmentedControl';
import {
  Block,
  Form,
  FormBody,
  FormBodyFull,
  Label,
  Row,
  RowFull,
  RowReadOnly,
} from '../styles/Card';
import { LicenseType, useLicenseName } from '../Tables/LicenseType';
import { ALL_PRICES_QUERY, CREATE_PRICE_MUTATION } from './Queries';

export default function PriceNew({ open, onClose }) {
  const { setAction } = useAction();
  const [createPrice, { loading, error }] = useMutation(CREATE_PRICE_MUTATION, {
    refetchQueries: [
      {
        query: ALL_PRICES_QUERY,
        variables: { skip: 0, take: perPage },
      },
    ],
    onCompleted: (data) => setAction('create', 'price', data.createLicensePrice.id),
  });
  const { licenseTypes } = useLicenseName();
  const { t } = useTranslation('license');
  const initialValues = useRef({
    default: false,
    users: [],
    validAfter: dateDay(),
    validUntil: dateInMonth(12),
    observation: '',
    type: 'license',
  });
  const { inputs, handleChange } = useForm(initialValues.current);

  function savePrice() {
    const data = {
      default: inputs.default,
      observation: inputs.observation,
      validAfter: inputs.validAfter,
      validUntil: inputs.validUntil,
    };
    if (inputs.users.length) {
      data.users = { connect: inputs.users.map((u) => ({ id: u.id })) };
    }

    const createPrices = [];
    if (inputs.type === 'license') {
      const prices = new Map();
      licenseTypes.forEach((lt) => {
        const price = prices.get(lt.id) || { id: lt.id };
        if (inputs[`${lt.id}:monthly`]) price.monthly = inputs[`${lt.id}:monthly`];
        if (inputs[`${lt.id}:yearly`]) price.yearly = inputs[`${lt.id}:yearly`];
        prices.set(lt.id, price);
      });
      prices.forEach((p) => {
        createPrices.push({
          type: 'license',
          licenseType: { connect: { id: p.id } },
          monthly: p.monthly.toString(),
          yearly: p.yearly.toString(),
        });
      });
    }
    if (inputs.type === 'umix') {
      createPrices.push({
        type: 'umix',
        unitPrice: inputs.unitPrice.toString(),
      });
    }

    data.items = {
      create: createPrices,
    };

    createPrice({ variables: { data } });
    onClose();
  }

  return (
    <Drawer onClose={onClose} open={open} title={t('new-price')}>
      <Form>
        <FormBody>
          <RowFull>
            <SegmentedControl
              options={[
                { label: t('license'), value: 'license' },
                { label: t('umix'), value: 'umix' },
                { label: t('hbeacon'), value: 'hbeacon', disabled: true },
              ]}
              value={inputs.type}
              onChange={(value) => handleChange({ name: 'type', value })}
            />
          </RowFull>
          <Row>
            <Label htmlFor="validAfter">{t('valid-after')}</Label>
            <Block>
              <DatePicker
                ISOStringValue={inputs.validAfter}
                id="validAfter"
                onChange={(dt) => handleChange({ name: 'validAfter', value: dt.toISOString() })}
              />
            </Block>
          </Row>
          <Row>
            <Label htmlFor="validUntil">{t('valid-until')}</Label>
            <Block>
              <DatePicker
                ISOStringValue={inputs.validUntil}
                id="validUntil"
                onChange={(dt) => handleChange({ name: 'validUntil', value: dt.toISOString() })}
              />
            </Block>
          </Row>
          <RowReadOnly>
            <Label>{t('default')}</Label>
            <SwitchComponent
              onChange={(value) => handleChange({ name: 'default', value })}
              checked={inputs.default}
            />
          </RowReadOnly>
        </FormBody>
        <FormBodyFull>
          {!inputs.default && (
            <Row>
              <Label htmlFor="users" required>
                {t('users')}
              </Label>
              <Block>
                <SearchUsers
                  id="users"
                  name="users"
                  value={inputs.users.map((u) => u.id)}
                  required
                  onChange={handleChange}
                />
              </Block>
            </Row>
          )}
          <Row>
            <Label>{t('observations')}</Label>
            <Block>
              <textarea
                id="observation"
                name="observation"
                onChange={handleChange}
                rows={3}
                value={inputs.observation}
              />
            </Block>
          </Row>
          <Row>
            {inputs.type === 'license' && licenseTypes.length && (
              <TableStyled>
                <thead>
                  <tr>
                    <th>{t('price-brut')}</th>
                    <th>{t('by-month')}</th>
                    <th>{t('by-year')}</th>
                  </tr>
                </thead>
                <tbody>
                  {licenseTypes.map((lt) => (
                    <tr key={lt.id}>
                      <td>
                        <LicenseType license={lt.id} />
                      </td>
                      <td>
                        <input
                          type="number"
                          name={`${lt.id}:monthly`}
                          value={inputs[`${lt.id}:monthly`] || '0'}
                          onChange={handleChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name={`${lt.id}:yearly`}
                          value={inputs[`${lt.id}:yearly`] || '0'}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableStyled>
            )}
            {(inputs.type === 'umix' || inputs.type === 'hbeacon') && (
              <>
                <Label>{t('unit-price')}</Label>
                <input
                  type="number"
                  name={'unitPrice'}
                  value={inputs.unitPrice || '0'}
                  onChange={handleChange}
                />
              </>
            )}
          </Row>
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonValidation disabled={loading} onClick={savePrice} />
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

PriceNew.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
