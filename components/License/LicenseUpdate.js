import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';

import Counter from '../Counter';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import ButtonPayment from '../Buttons/ButtonPayment';
import ButtonCancel from '../Buttons/ButtonCancel';
import { useFindLicense, UPDATE_LICENSE_MUTATION } from './Queries';
import {
  FormBodyFull,
  Label,
  Row,
  Form,
  Block,
  RowReadOnly,
  FormBody,
  RowFull,
  Separator,
} from '../styles/Card';
import useForm from '../../lib/useForm';
import LicensePrice, { usePrice } from './LicensePrice';
import Total from '../TotalCount';
import { useFindApplication } from '../Application/Queries';
import useFindUser from '../../lib/useFindUser';
import { useFindSignal } from '../Signal/Queries';
import { dateDay, formatDate } from '../DatePicker';
import useVat from '../../lib/useVat';
import { LicenseType } from '../Tables/LicenseType';
import Loading from '../Loading';

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
  const { license, licenseLoading, licenseError } = useFindLicense(licenseId);
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
  const [purchaseData, setPurchaseDate] = useState({
    licenseId,
    expectedAmountBrut: 0,
    purchaseItems: [],
  });

  function closeAndClear(orderId) {
    resetForm();
    onClose(orderId);
  }

  function handleSuccess(orderId) {
    closeAndClear(orderId);
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
        const pData = [];
        const tot =
          parseInt(monthLicense || 0) *
            parseInt(license.nbArea || 1) *
            parseFloat(myPrice.monthly) +
          parseInt(yearLicense || 0) *
            parseInt(license.nbArea || 1) *
            parseFloat(myPrice.yearly);
        setTotal({ amount: tot });
        if (parseInt(monthLicense)) {
          pData.push({
            licenseTypeId: license.licenseType.id,
            priceItemId: myPrice.id,
            itemName: t(`item-name-${license.licenseType.name}-renew-yearly`),
            quantity: parseInt(monthLicense),
            nbArea: license.nbArea || 1,
            monthly: true,
          });
        }
        if (parseInt(yearLicense)) {
          pData.push({
            licenseTypeId: license.licenseType.id,
            priceItemId: myPrice.id,
            itemName: t(`item-name-${license.licenseType.name}-renew-yearly`),
            quantity: parseInt(yearLicense),
            nbArea: license.nbArea || 1,
            monthly: false,
          });
        }
        setPurchaseDate((prev) => ({
          ...prev,
          expectedAmountBrut: tot,
          purchaseItems: pData,
          vatId: vat.id,
        }));
      }
    }

    let validity = new Date(license.validity);
    const now = new Date();
    if (now > validity) validity = now;
    validity.setMonth(validity.getMonth() + parseInt(inputs.monthLicense));
    validity.setFullYear(validity.getFullYear() + parseInt(inputs.yearLicense));
    setNewValidity(validity.toISOString());
  }, [inputs, price, license, setNewValidity]);

  if (licenseLoading) return <Loading />;
  if (licenseError) return <DisplayError error={licenseError} />;

  return (
    <Drawer onClose={closeAndClear} open={open} title={t('update-license')}>
      {error && <DisplayError error={error} />}
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
                licenseTypeIds={[{ id: license.licenseType.id }]}
              />
            )}
          </Row>
          <LicenseType license={license.licenseType.id}>
            {license.licenseType.perArea && (
              <span>
                &nbsp;- {t('nb-area-validity', { count: license.nbArea })}
              </span>
            )}
          </LicenseType>
          <Separator />
          <FormBody>
            <RowFull>
              <Counter
                label={t('nb-month')}
                name="monthLicense"
                input={inputs.monthLicense || 0}
                handleChange={handleChange}
              />
              <Counter
                label={t('nb-year')}
                name="yearLicense"
                input={inputs.yearLicense || 0}
                handleChange={handleChange}
              />
            </RowFull>
          </FormBody>
          <RowReadOnly>
            <Label>{t('new-validity')}</Label>
            <span>{formatDate(newValidity)}</span>
          </RowReadOnly>
          <Total value={total} vat={parseFloat(vat.value)} />
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonPayment
          disabled={loading || total.amount <= 0}
          onSuccess={handleSuccess}
          onError={handleError}
          purchaseFunction={updateLicense}
          data={purchaseData}
        />
        <ButtonCancel onClick={() => closeAndClear(null)} />
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
