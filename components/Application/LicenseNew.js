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
import { useFindApplication } from './Queries';
import { useFindUser } from '../SearchUser';
import ButtonFreeTrial from '../Buttons/ButtonFreeTrial';

const CREATE_LICENSE_MUTATION = gql`
  mutation CREATE_LICENSE_MUTATION($data: [LicensesCreateInput]!) {
    createLicenses(data: $data) {
      id
    }
  }
`;

export default function LicenseNew({ open, onClose, appId, ownerId }) {
  const [createLicense, { loading, error }] = useMutation(
    CREATE_LICENSE_MUTATION
  );
  const { user, userError } = useFindUser(ownerId);
  const { application, applicationError } = useFindApplication(appId);
  const [total, setTotal] = useState(0);
  const [vat, setVat] = useState(0.2);
  const { t } = useTranslation('license');
  const initialValues = useRef({
    MonthLicense: 0,
    YearLicense: 0,
    MonthArea: 1,
    YearArea: 1,
  });
  const { inputs, handleChange } = useForm(initialValues.current);
  const [trial, setTrial] = useState(false);
  const { price, licenseTypeId, setLicenseTypeId } = usePrice(ownerId);

  useEffect(() => {
    const okTrial = application?.licenses.length === 0;
    setTrial(okTrial);
    setLicenseTypeId(application?.licenseType?.id);
  }, [application, setTrial, setLicenseTypeId]);

  function handleSuccess() {
    // TODO: handle payment before creating licenses
    const purchaseInformation = 'Purchase informations';
    const { MonthLicense, YearLicense, MonthArea, YearArea } = inputs;
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
          },
        });
      const variables = { data: licenses };
      createLicense({ variables }).catch((err) => alert(err.message));
    }
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    createNLicenses(MonthLicense, MonthArea, oneMonthFromNow.toISOString());
    createNLicenses(YearLicense, YearArea, oneYearFromNow.toISOString());
    onClose();
  }

  function handleError(error) {
    console.log(`error`, error);
  }

  useEffect(() => {
    const { MonthLicense, YearLicense, MonthArea, YearArea } = inputs;
    if (price?.items) {
      const myPrice = price.items.filter(
        (p) => p.licenseType.id === licenseTypeId
      )[0];

      const tot =
        parseInt(MonthLicense || 0) *
          parseInt(MonthArea || 1) *
          parseFloat(myPrice.monthly) +
        parseInt(YearLicense || 0) *
          parseInt(YearArea || 1) *
          parseFloat(myPrice.yearly);
      setTotal(tot);
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
              <Counter
                label={t('by-month')}
                name="MonthLicense"
                input={inputs.MonthLicense}
                handleChange={handleChange}
              />
              <Counter
                label={t('by-year')}
                name="YearLicense"
                input={inputs.YearLicense}
                handleChange={handleChange}
              />
            </Row>
            {application.licenseType.perArea && (
              <Row>
                <H3>{t('nb-area')}</H3>
                <Counter
                  label=""
                  name="MonthArea"
                  input={inputs.MonthArea}
                  handleChange={handleChange}
                  min={1}
                />
                <Counter
                  label=""
                  name="YearArea"
                  input={inputs.YearArea}
                  handleChange={handleChange}
                  min={1}
                />
              </Row>
            )}
          </FormBody>
          <Total
            value={total}
            nbLicense={
              inputs.MonthLicense * inputs.MonthArea +
              inputs.YearLicense * inputs.YearArea
            }
            nbSignal={inputs.MonthLicense + inputs.YearLicense}
            vat={vat}
          />
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonPayment
          disabled={loading || !total}
          onSuccess={handleSuccess}
          onError={handleError}
          amount={total * (1 + vat)}
        />
      </DrawerFooter>
      {trial && (
        <ButtonFreeTrial ownerId={ownerId} appId={appId} onSuccess={onClose} />
      )}
      <ButtonCancel onClick={onClose} />
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
