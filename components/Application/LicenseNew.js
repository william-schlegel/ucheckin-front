import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';

import Counter from '../Counter';
import Drawer from '../Drawer';
import DisplayError from '../ErrorMessage';
import ButtonPayment from '../Buttons/ButtonPayment';
import ButtonCancel from '../Buttons/ButtonCancel';
import { DrawerFooter } from '../styles/Drawer';
import {
  FormBodyFull,
  Label,
  Row,
  Form,
  Block,
  H2,
  FormBody,
  H3,
  RowReadOnly,
} from '../styles/Card';
import useForm from '../../lib/useForm';
import LicensePrice, { usePrice } from '../License/LicensePrice';
import Total from '../TotalCount';
import { QUERY_APPLICATION, useFindApplication } from './Queries';
import useFindUser from '../../lib/useFindUser';
import ButtonFreeTrial from '../Buttons/ButtonFreeTrial';
import { dateInMonth } from '../DatePicker';
import useVat from '../../lib/useVat';

const CREATE_LICENSE_MUTATION = gql`
  mutation CREATE_LICENSE_MUTATION($data: [LicensesCreateInput]!) {
    createLicenses(data: $data) {
      id
    }
  }
`;

export default function LicenseNew({ open, onClose, appId, ownerId }) {
  const [createLicense, { loading, error }] = useMutation(
    CREATE_LICENSE_MUTATION,
    {
      refetchQueries: [{ query: QUERY_APPLICATION, variables: { id: appId } }],
    }
  );
  const { user, userError } = useFindUser(ownerId);
  const { application, applicationError } = useFindApplication(appId);
  const [total, setTotal] = useState(0);
  const { vat } = useVat(ownerId);
  const { t } = useTranslation('license');
  const initialValues = useRef({
    monthLicense: 0,
    yearLicense: 0,
    monthArea: 1,
    yearArea: 1,
  });
  const { inputs, handleChange, resetForm } = useForm(initialValues.current);
  const [trial, setTrial] = useState(false);
  const { price, licenseTypeId, setLicenseTypeId } = usePrice(ownerId);

  useEffect(() => {
    const okTrial = application?.licenses.length === 0;
    setTrial(okTrial);
    setLicenseTypeId(application?.licenseType?.id);
  }, [application, setTrial, setLicenseTypeId]);

  function handleSuccess() {
    const purchaseInformation = 'Purchase informations';
    const { monthLicense, yearLicense, monthArea, yearArea } = inputs;
    const licenses = [];

    function createNLicenses(number, nbArea, validity) {
      for (let s = 0; s < number; s += 1)
        licenses.push({
          data: {
            owner: { connect: { id: ownerId } },
            licenseType: { connect: { id: licenseTypeId } },
            nbArea,
            validity,
            purchaseInformation,
            application: { connect: { id: appId } },
            signal: { create: { owner: { connect: { id: ownerId } } } },
          },
        });
      const variables = { data: licenses };
      createLicense({ variables }).catch((err) => alert(err.message));
    }

    createNLicenses(monthLicense, monthArea, dateInMonth(1));
    createNLicenses(yearLicense, yearArea, dateInMonth(12));
    resetForm();
    onClose();
  }

  function handleError(error) {
    console.log(`error`, error);
  }

  useEffect(() => {
    const { monthLicense, yearLicense, monthArea, yearArea } = inputs;
    if (price?.items) {
      const myPrice = price.items.filter(
        (p) => p.licenseType.id === licenseTypeId
      )[0];
      if (myPrice) {
        const tot =
          parseInt(monthLicense || 0) *
            parseInt(monthArea || 1) *
            parseFloat(myPrice.monthly) +
          parseInt(yearLicense || 0) *
            parseInt(yearArea || 1) *
            parseFloat(myPrice.yearly);
        setTotal(tot);
      }
    }
  }, [inputs, price, licenseTypeId]);

  if (userError) return <DisplayError error={userError} />;
  if (applicationError) return <DisplayError error={applicationError} />;
  return (
    <Drawer onClose={onClose} open={open} title={t('new-license')}>
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
          <Row>
            {user?.id && (
              <LicensePrice owner={user.id} licenseTypeId={licenseTypeId} />
            )}
          </Row>
          <H2>{t(application.licenseType.name || 'common:unknown')}</H2>
          <FormBody>
            <Row>
              <H3>{t('nb-signal')}</H3>
              <div>
                <Counter
                  label={t('by-month')}
                  name="monthLicense"
                  input={inputs.monthLicense}
                  handleChange={handleChange}
                />
                <Counter
                  label={t('by-year')}
                  name="yearLicense"
                  input={inputs.yearLicense}
                  handleChange={handleChange}
                />
              </div>
            </Row>
            {application.licenseType.perArea && (
              <Row>
                <H3>{t('nb-area')}</H3>
                <div>
                  <Counter
                    label=""
                    name="monthArea"
                    input={inputs.monthArea}
                    handleChange={handleChange}
                    min={1}
                  />
                  <Counter
                    label=""
                    name="yearArea"
                    input={inputs.yearArea}
                    handleChange={handleChange}
                    min={1}
                  />
                </div>
              </Row>
            )}
          </FormBody>
          <Total
            value={total}
            nbLicense={
              inputs.monthLicense * inputs.monthArea +
              inputs.yearLicense * inputs.yearArea
            }
            nbSignal={inputs.monthLicense + inputs.yearLicense}
            vat={vat.value}
          />
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonPayment
          disabled={loading || !total}
          onSuccess={handleSuccess}
          onError={handleError}
          amount={total * (1 + vat.value)}
        />
        {trial && (
          <ButtonFreeTrial
            ownerId={ownerId}
            appId={appId}
            onSuccess={onClose}
          />
        )}
        <ButtonCancel onClick={onClose} />
      </DrawerFooter>
      {error && <DisplayError error={error} />}
    </Drawer>
  );
}

LicenseNew.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  appId: PropTypes.string.isRequired,
  ownerId: PropTypes.string.isRequired,
};
