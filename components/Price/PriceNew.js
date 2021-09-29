import { useRef } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import SwitchComponent from 'react-switch';

import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import ButtonValidation from '../Buttons/ButtonValidation';
import ButtonCancel from '../Buttons/ButtonCancel';
import { ALL_PRICES_QUERY, CREATE_PRICE_MUTATION } from './Queries';
import {
  Label,
  Row,
  Form,
  FormBody,
  Block,
  RowReadOnly,
  FormBodyFull,
} from '../styles/Card';
import useForm from '../../lib/useForm';
import { perPage } from '../../config';
import DatePicker, { dateDay, dateInMonth } from '../DatePicker';
import { SearchUsers } from '../SearchUser';
import { TableStyled } from '../License/LicensePrice';
import { LicenseType, useLicenseName } from '../Tables/LicenseType';

export default function PriceNew({ open, onClose }) {
  const [createPrice, { loading, error }] = useMutation(CREATE_PRICE_MUTATION, {
    refetchQueries: [
      {
        query: ALL_PRICES_QUERY,
        variables: { skip: 0, take: perPage },
      },
    ],
  });
  const { licenseTypes } = useLicenseName();
  const { t } = useTranslation('license');
  const initialValues = useRef({
    default: false,
    users: [],
    validAfter: dateDay(),
    validUntil: dateInMonth(12),
    observation: '',
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
      data.users = { connect: inputs.users.map((u) => ({ id: u.value })) };
    }

    const prices = new Map();
    licenseTypes.forEach((lt) => {
      const price = prices.get(lt.id) || { id: lt.id };
      if (inputs[`${lt.id}:monthly`])
        price.monthly = inputs[`${lt.id}:monthly`];
      if (inputs[`${lt.id}:yearly`]) price.yearly = inputs[`${lt.id}:yearly`];
      prices.set(lt.id, price);
    });
    const createPrices = [];
    prices.forEach((p) => {
      createPrices.push({
        licenseType: { connect: { id: p.id } },
        monthly: p.monthly.toString(),
        yearly: p.yearly.toString(),
      });
    });

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
          <Row>
            <Label htmlFor="validAfter">{t('valid-after')}</Label>
            <Block>
              <DatePicker
                ISOStringValue={inputs.validAfter}
                id="validAfter"
                onChange={(dt) =>
                  handleChange({ name: 'validAfter', value: dt.toISOString() })
                }
              />
            </Block>
          </Row>
          <Row>
            <Label htmlFor="validUntil">{t('valid-until')}</Label>
            <Block>
              <DatePicker
                ISOStringValue={inputs.validUntil}
                id="validUntil"
                onChange={(dt) =>
                  handleChange({ name: 'validUntil', value: dt.toISOString() })
                }
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
            {licenseTypes.length && (
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
