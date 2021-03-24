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
} from '../styles/Card';
import useForm from '../../lib/useForm';
import LicensePrice, { usePrice } from './LicensePrice';
import Total from '../TotalCount';
import { useFindApplication } from '../Application/Queries';
import { useFindUser } from '../SearchUser';
import { useFindSignal } from '../Signal/Queries';
import { formatDate } from '../DatePicker';

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
  const { license } = useFindLicense(licenseId);
  const { user } = useFindUser(ownerId);
  const { application } = useFindApplication(appId);
  const { signal } = useFindSignal(signalId);
  const { price } = usePrice(ownerId);
  const [total, setTotal] = useState(0);
  const [newValidity, setNewValidity] = useState(new Date().toISOString());
  const { t } = useTranslation('license');
  const initialValues = useRef({
    ucheckInMonth: 0,
    ucheckInYear: 0,
    wiUsMonth: 0,
    wiUsYear: 0,
  });
  const { inputs, handleChange } = useForm(initialValues.current);
  const validityDate = license?.validity;

  function handleSubmit() {
    // TODO: handle payment before creating licenses
    updateLicense({
      variables: {
        id: licenseId,
        newValidity,
      },
    });
    onClose();
  }

  useEffect(() => {
    if (validityDate) setNewValidity(validityDate);
  }, [validityDate]);

  useEffect(() => {
    const { ucheckInMonth, ucheckInYear, wiUsMonth, wiUsYear } = inputs;
    const tot =
      parseInt(ucheckInMonth || 0) *
        license.nbArea *
        parseFloat(price.ucheckInMonthly) +
      parseInt(ucheckInYear || 0) *
        license.nbArea *
        parseFloat(price.ucheckInYearly) +
      parseInt(wiUsMonth || 0) * parseFloat(price.wiUsMonthly) +
      parseInt(wiUsYear || 0) * parseFloat(price.wiUsYearly);
    setTotal(tot);
    const validity = new Date(license.validity);
    if (license.licenseType === 'UCHECKIN') {
      validity.setMonth(validity.getMonth() + parseInt(inputs.ucheckInMonth));
      validity.setFullYear(
        validity.getFullYear() + parseInt(inputs.ucheckInYear)
      );
    } else if (license.licenseType === 'WIUS') {
      validity.setMonth(validity.getMonth() + parseInt(inputs.wiUsMonth));
      validity.setFullYear(validity.getFullYear() + parseInt(inputs.wiUsYear));
    }
    setNewValidity(validity.toISOString());
  }, [inputs, price, license, setNewValidity]);

  return (
    <Drawer onClose={onClose} open={open} title={t('update-license')}>
      <Form>
        <FormBodyFull>
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
          <RowReadOnly>
            <Label>{t('signal')}</Label>
            <Block>
              <span>{signal.name}</span>
            </Block>
          </RowReadOnly>
          <Row>
            {ownerId && (
              <LicensePrice
                owner={ownerId}
                dayDate={new Date().toISOString()}
              />
            )}
          </Row>
          {application.licenseType === 'UCHECKIN' && (
            <>
              <H2>{t('nb-area-validity', { count: license.nbArea })}</H2>
              <Row>
                <Counter
                  label={t('nb-month')}
                  name="ucheckInMonth"
                  input={inputs.ucheckInMonth}
                  handleChange={handleChange}
                />
                <Counter
                  label={t('nb-year')}
                  name="ucheckInYear"
                  input={inputs.ucheckInYear}
                  handleChange={handleChange}
                />
              </Row>
            </>
          )}
          {application.licenseType === 'WIUS' && (
            <>
              <H2>{t('wi-us')}</H2>
              <Row>
                <Counter
                  label={t('nb-month')}
                  name="wiUsMonth"
                  input={inputs.wiUsMonth}
                  handleChange={handleChange}
                />
                <Counter
                  label={t('nb-year')}
                  name="wiUsYear"
                  input={inputs.wiUsYear}
                  handleChange={handleChange}
                />
              </Row>
            </>
          )}
          <RowReadOnly>
            <Label>{t('new-validity')}</Label>
            <span>{formatDate(newValidity)}</span>
          </RowReadOnly>
          <Total value={total} />
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonPayment disabled={loading || !total} onClick={handleSubmit} />
        <ButtonCancel onClick={onClose} />
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
  signalId: PropTypes.string.isRequired,
};
