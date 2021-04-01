import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';

import styled from 'styled-components';
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
  FormBody,
  H3,
  RowReadOnly,
} from '../styles/Card';
import useForm from '../../lib/useForm';
import LicensePrice, { usePrice } from '../License/LicensePrice';
import Total from '../TotalCount';
import { APPLICATION_QUERY, useFindApplication } from './Queries';
import useFindUser from '../../lib/useFindUser';
import ButtonFreeTrial from '../Buttons/ButtonFreeTrial';
import { dateInMonth, dateNow } from '../DatePicker';
import useVat from '../../lib/useVat';
import { CREATE_LICENSE_MUTATION } from '../License/Queries';
import { CREATE_ORDER_MUTATION } from '../Order/Queries';
import { LicenseType } from '../Tables/LicenseType';

export default function LicenseNew({ open, onClose, appId, ownerId }) {
  const [createLicense, { loading, error }] = useMutation(
    CREATE_LICENSE_MUTATION,
    {
      refetchQueries: [{ query: APPLICATION_QUERY, variables: { id: appId } }],
    }
  );
  const [createOrder, { error: orderError }] = useMutation(
    CREATE_ORDER_MUTATION
  );
  const { user, userError } = useFindUser(ownerId);
  const { application, applicationError } = useFindApplication(appId);
  const [total, setTotal] = useState(0);
  const [nbSignal, setNbSignal] = useState(0);
  const [nbLicense, setNbLicense] = useState(0);
  const { vat } = useVat(ownerId);
  const { t } = useTranslation('license');
  const initialValues = useRef({
    monthLicense: {},
    yearLicense: {},
    monthArea: {},
    yearArea: {},
  });
  const { inputs, handleChange, resetForm } = useForm(initialValues.current);
  const [trial, setTrial] = useState(false);
  const { price, licenseTypeIds, setLicenseTypeIds } = usePrice(ownerId);

  useEffect(() => {
    const okTrial = application?.licenses.length === 0;
    setTrial(okTrial);
    setLicenseTypeIds(application?.licenseTypes);
  }, [application, setTrial, setLicenseTypeIds]);

  function handleSuccess() {
    // const purchaseInformation = 'Purchase informations';
    // const { monthLicense, yearLicense, monthArea, yearArea } = inputs;
    // function createNLicenses(number, nbArea, validity) {
    //   const licenses = [];
    //   for (let s = 0; s < number; s += 1) {
    //     licenses.push({
    //       data: {
    //         owner: { connect: { id: ownerId } },
    //         licenseType: { connect: { id: licenseTypeId } },
    //         nbArea,
    //         validity,
    //         purchaseInformation,
    //         application: { connect: { id: appId } },
    //         signal: { create: { owner: { connect: { id: ownerId } } } },
    //       },
    //     });
    //   }
    //   const variables = { data: licenses };
    //   createLicense({ variables }).catch((err) => alert(err.message));
    // }
    // createNLicenses(monthLicense, monthArea, dateInMonth(1));
    // createNLicenses(yearLicense, yearArea, dateInMonth(12));
    // // create order
    // const myPrice = price.items.filter(
    //   (p) => p.licenseType.id === licenseTypeId
    // )[0];
    // const orderItems = [];
    // if (monthLicense)
    //   orderItems.push({
    //     licenseType: { connect: { id: licenseTypeId } },
    //     nbArea: monthArea,
    //     unitPrice: myPrice.monthly,
    //     quantity: monthLicense,
    //   });
    // if (yearLicense)
    //   orderItems.push({
    //     licenseType: { connect: { id: licenseTypeId } },
    //     nbArea: yearArea,
    //     unitPrice: myPrice.yearly,
    //     quantity: yearLicense,
    //   });
    // const orderData = {
    //   user: { connect: { id: ownerId } },
    //   totalBrut: total.toString(),
    //   vatValue: vat.value.toString(),
    //   orderDate: dateNow(),
    //   items: { create: orderItems },
    // };
    // createOrder({ variables: { data: orderData } });
    // resetForm();
    // onClose();
  }

  function handleError(error) {
    console.log(`error`, error);
  }

  useEffect(() => {
    const { monthLicense, yearLicense, monthArea, yearArea } = inputs;
    let tot = 0;
    let nbL = 0;
    let nbS = 0;
    if (application?.licenseTypes) {
      application.licenseTypes.forEach((lt) => {
        if (price?.items) {
          const myPrice = price.items.filter(
            (p) => p.licenseType.id === lt.id
          )[0];
          if (myPrice) {
            tot +=
              parseInt(monthLicense[lt.id] || 0) *
                parseInt(monthArea[lt.id] || 1) *
                parseFloat(myPrice.monthly) +
              parseInt(yearLicense[lt.id] || 0) *
                parseInt(yearArea[lt.id] || 1) *
                parseFloat(myPrice.yearly);
          }
        }
        nbL +=
          (inputs.monthLicense[lt.id] || 0) * (inputs.monthArea[lt.id] || 1) +
          (inputs.yearLicense[lt.id] || 0) * (inputs.yearArea[lt.id] || 1);
        nbS += lt.perArea
          ? (inputs.monthLicense[lt.id] || 0) + (inputs.yearLicense[lt.id] || 0)
          : 0;
      });
      setTotal(tot);
      setNbLicense(nbL);
      setNbSignal(nbS);
    }
  }, [inputs, price, licenseTypeIds, application]);

  if (userError) return <DisplayError error={userError} />;
  if (orderError) return <DisplayError error={orderError} />;
  if (applicationError) return <DisplayError error={applicationError} />;

  console.log(`inputs`, inputs);

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
              <LicensePrice owner={user.id} licenseTypeIds={licenseTypeIds} />
            )}
          </Row>
          {application.licenseTypes.map((lt) => (
            <LicenseContainer key={lt.id}>
              {/* <H2>{t(lt?.name || 'common:unknown')}</H2> */}
              <LicenseType license={lt.id} />
              <hr />
              <FormBody>
                <Row>
                  <H3>{t(lt.perArea ? 'nb-signal' : 'nb-license')}</H3>
                  <div>
                    <Counter
                      label={t('by-month')}
                      name={`monthLicense.${lt.id}`}
                      input={inputs.monthLicense[lt.id] || 0}
                      handleChange={handleChange}
                    />
                    <Counter
                      label={t('by-year')}
                      name={`yearLicense.${lt.id}`}
                      input={inputs.yearLicense[lt.id] || 0}
                      handleChange={handleChange}
                    />
                  </div>
                </Row>
                {lt.perArea && (
                  <Row>
                    <H3>{t('nb-area')}</H3>
                    <div>
                      <Counter
                        label=""
                        name={`monthArea.${lt.id}`}
                        input={inputs.monthArea[lt.id] || 1}
                        handleChange={handleChange}
                        min={1}
                      />
                      <Counter
                        label=""
                        name={`yearArea.${lt.id}`}
                        input={inputs.yearArea[lt.id] || 1}
                        handleChange={handleChange}
                        min={1}
                      />
                    </div>
                  </Row>
                )}
              </FormBody>
            </LicenseContainer>
          ))}
          <Total
            value={total}
            nbLicense={nbLicense}
            nbSignal={nbSignal}
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

const LicenseContainer = styled.div`
  border: 1px solid var(--secondary);
  padding: 1rem 0.5rem;
`;
