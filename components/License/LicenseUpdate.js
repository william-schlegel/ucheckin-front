import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';

import Counter from '../Counter';
import Drawer from '../Drawer';
import DisplayError from '../ErrorMessage';
import ButtonPayment from '../Buttons/ButtonPayment';
import ButtonCancel from '../Buttons/ButtonCancel';
import { useFindLicense, UPDATE_LICENSE_MUTATION } from './Queries';
import { DrawerFooter } from '../styles/Drawer';
import {
  FormBodyFull,
  Label,
  Row,
  Form,
  Block,
  H2,
  RowReadOnly,
  FormBody,
} from '../styles/Card';
import useForm from '../../lib/useForm';
import LicensePrice, { usePrice } from './LicensePrice';
import Total from '../TotalCount';
import { useFindApplication } from '../Application/Queries';
import useFindUser from '../../lib/useFindUser';
import { useFindSignal } from '../Signal/Queries';
import { dateDay, dateNow, formatDate } from '../DatePicker';
import useVat from '../../lib/useVat';
import { CREATE_ORDER_MUTATION } from '../Order/Queries';

export default function LicenseUpdate({
  open,
  onClose,
  licenseId,
  appId,
  ownerId,
  signalId,
}) {
  const [updateLicense, { loading, error }] = useMutation(
    UPDATE_LICENSE_MUTATION
  );
  const [createOrder, { error: orderError }] = useMutation(
    CREATE_ORDER_MUTATION
  );
  const { license } = useFindLicense(licenseId);

  const { user } = useFindUser(ownerId);
  const { application } = useFindApplication(appId);
  const { signal } = useFindSignal(signalId);
  const [total, setTotal] = useState({ amount: 0, licenses: 0, signals: 0 });
  const { t } = useTranslation('license');
  const initialValues = useRef({
    monthLicense: 0,
    yearLicense: 0,
  });
  const { inputs, handleChange, resetForm } = useForm(initialValues.current);
  const { price } = usePrice(ownerId);
  const { vat } = useVat(ownerId);
  const [newValidity, setNewValidity] = useState(dateDay());
  const validityDate = license?.validity;

  function closeAndClear() {
    resetForm();
    onClose();
  }

  function handleSuccess() {
    // create order
    const { monthLicense, yearLicense } = inputs;
    const myPrice = price.items.filter(
      (p) => p.licenseType.id === license.licenseType.id
    )[0];
    console.log(`myPrice`, myPrice);

    const orderItems = [];
    if (monthLicense)
      orderItems.push({
        licenseType: { connect: { id: license.licenseType.id } },
        nbArea: license.nbArea,
        unitPrice: myPrice.monthly,
        quantity: monthLicense,
      });
    if (yearLicense)
      orderItems.push({
        licenseType: { connect: { id: license.licenseType.id } },
        nbArea: license.nbArea,
        unitPrice: myPrice.yearly,
        quantity: yearLicense,
      });
    const orderData = {
      user: { connect: { id: ownerId } },
      totalBrut: total.amount.toString(),
      vatValue: vat.value.toString(),
      orderDate: dateNow(),
      items: { create: orderItems },
    };
    console.log(`orderData`, orderData);
    createOrder({ variables: { data: orderData } });

    console.log(`newValidity`, newValidity);
    // update validity
    updateLicense({
      variables: {
        id: licenseId,
        newValidity,
      },
    });

    closeAndClear();
  }

  function handleError(error) {
    console.log(`error`, error);
  }

  useEffect(() => {
    if (validityDate) {
      setNewValidity(validityDate);
    }
  }, [validityDate]);

  useEffect(() => {
    const { monthLicense, yearLicense } = inputs;

    if (price?.items) {
      const myPrice = price.items.filter(
        (p) => p.licenseType.id === license.licenseType.id
      )[0];
      if (myPrice) {
        const tot =
          parseInt(monthLicense || 0) *
            parseInt(license.nbArea || 1) *
            parseFloat(myPrice.monthly) +
          parseInt(yearLicense || 0) *
            parseInt(license.nbArea || 1) *
            parseFloat(myPrice.yearly);
        setTotal({ amount: tot });
      }
    }

    let validity = new Date(license.validity);
    const now = new Date();
    if (now > validity) validity = now;
    validity.setMonth(validity.getMonth() + parseInt(inputs.monthLicense));
    validity.setFullYear(validity.getFullYear() + parseInt(inputs.yearLicense));
    setNewValidity(validity.toISOString());
  }, [inputs, price, license, setNewValidity]);

  return (
    <Drawer onClose={closeAndClear} open={open} title={t('update-license')}>
      {error && <DisplayError error={error} />}
      {orderError && <DisplayError error={orderError} />}
      <Form>
        <FormBody>
          <RowReadOnly>
            <Label>{t('common:owner')}</Label>
            <Block>
              <span>{user.name}</span>
            </Block>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('application')}</Label>
            <Block>
              <span>{application.name}</span>
            </Block>
          </RowReadOnly>
          {signalId && (
            <RowReadOnly>
              <Label>{t('signal')}</Label>
              <Block>
                <span>{signal.name}</span>
              </Block>
            </RowReadOnly>
          )}{' '}
        </FormBody>
        <FormBodyFull>
          <Row>
            {user.id && (
              <LicensePrice
                owner={user.id}
                licenseTypeId={license?.licenseType?.id}
              />
            )}
          </Row>
          <H2>{t(application.licenseType.name || 'common:unknown')}</H2>
          {application.licenseType.perArea && (
            <Row>{t('nb-area-validity', { count: license.nbArea })}</Row>
          )}
          <Row>
            <Block>
              <Counter
                label={t('nb-month')}
                name="monthLicense"
                input={inputs.monthLicense}
                handleChange={handleChange}
              />
              <Counter
                label={t('nb-year')}
                name="yearLicense"
                input={inputs.yearLicense}
                handleChange={handleChange}
              />
            </Block>
          </Row>
          <RowReadOnly>
            <Label>{t('new-validity')}</Label>
            <span>{formatDate(newValidity)}</span>
          </RowReadOnly>
          <Total value={total} vat={vat.value} />
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonPayment
          disabled={loading || total.amount <= 0}
          onSuccess={handleSuccess}
          onError={handleError}
          amount={total.amount * (1 + vat.value)}
        />
        <ButtonCancel onClick={closeAndClear} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

LicenseUpdate.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  licenseId: PropTypes.string.isRequired,
  appId: PropTypes.string.isRequired,
  ownerId: PropTypes.string.isRequired,
  signalId: PropTypes.string,
};
