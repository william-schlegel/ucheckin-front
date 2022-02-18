import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import styled from 'styled-components';

import { perPage } from '../../config';
import { formatMoney } from '../../lib/formatNumber';
import useFindUser from '../../lib/useFindUser';
import useForm from '../../lib/useForm';
import useVat from '../../lib/useVat';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonPayment from '../Buttons/ButtonPayment';
import Counter from '../Counter';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import FieldError from '../FieldError';
import { usePrice } from '../License/LicensePrice';
import { PURCHASE_PRODUCT_MUTATION } from '../License/Queries';
import { Form, FormBodyFull, Label, Row } from '../styles/Card';
import { TotalProduct } from '../TotalCount';
import { ALL_UMIXES_QUERY } from './Queries';

export default function UmixNew({ open, onClose, ownerId }) {
  const { addToast } = useToasts();

  const [purchaseProduct, { error: errorProduct }] = useMutation(PURCHASE_PRODUCT_MUTATION, {
    refetchQueries: [
      {
        query: ALL_UMIXES_QUERY,
        variables: { skip: 0, take: perPage },
      },
    ],
    onCompleted: () => {
      addToast(t('umix-success'), { appearance: 'success', autoDismiss: true });
      onClose();
    },
  });
  const { price } = usePrice(ownerId, 'umix');
  const { t } = useTranslation('umix');
  const { vat } = useVat(ownerId);
  const [unitPrice, setUnitPrice] = useState(0);
  const [invoicingModel, setInvoicingModel] = useState('online');
  const { user, userError } = useFindUser(ownerId);

  const initialValues = useRef({
    name: '',
    description: '',
    nbUmix: 0,
  });
  const { inputs, handleChange, validate, validationError } = useForm(initialValues.current, [
    'name',
  ]);

  useEffect(() => {
    if (user) {
      setInvoicingModel(user.invoicingModel);
    }
  }, [user]);

  useEffect(() => {
    if (price.id && price.items && price.items.length)
      setUnitPrice(Number(price.items[0].unitPrice));
  }, [price]);

  function handleError(error) {
    console.error(`error`, error);
  }

  function handleValidation() {
    const newInputs = validate();
    if (!newInputs) return;
    return {
      ownerId: user.id,
      priceItemId: price.items[0].id,
      productType: 'umix',
      productName: newInputs.name,
      productDescription: newInputs.description,
      quantity: Number(newInputs.nbUmix),
      expectedAmountBrut: Number(newInputs.nbUmix) * unitPrice,
      vatId: vat.id,
    };
  }

  return (
    <Drawer onClose={onClose} open={open} title={t('new-umix')}>
      {price.id ? (
        <>
          <Form>
            <FormBodyFull>
              <Price>{t('your-price', { price: formatMoney(unitPrice) })}</Price>
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
                <Label htmlFor="description">{t('common:description')}</Label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={inputs.description}
                  onChange={handleChange}
                />
              </Row>
              <Row>
                <Counter
                  label={t('nb-umix')}
                  name={'nbUmix'}
                  input={inputs.nbUmix || 0}
                  handleChange={handleChange}
                />
              </Row>
              <TotalProduct qty={inputs.nbUmix} unitPrice={unitPrice} vat={Number(vat.value)} />
            </FormBodyFull>
          </Form>
          <DrawerFooter>
            <ButtonPayment
              disabled={!(unitPrice * inputs.nbUmix)}
              onError={handleError}
              purchaseFunction={purchaseProduct}
              invoicingModel={invoicingModel}
              validationFunction={handleValidation}
            />
            <ButtonCancel onClick={onClose} />
            {userError && <DisplayError error={userError} />}
            {errorProduct && <DisplayError error={errorProduct} />}
          </DrawerFooter>
        </>
      ) : (
        <div>{t('no-price')}</div>
      )}
    </Drawer>
  );
}

UmixNew.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

const Price = styled.div`
  font-size: 2rem;
  color: var(--secondary);
`;
