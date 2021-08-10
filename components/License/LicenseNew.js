import { useEffect, useReducer } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';

import Counter from '../Counter';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import ButtonPayment from '../Buttons/ButtonPayment';
import ButtonCancel from '../Buttons/ButtonCancel';
import {
  FormBodyFull,
  Label,
  Row,
  Form,
  Block,
  FormBody,
  H3,
  RowReadOnly,
  Separator,
} from '../styles/Card';
import useForm from '../../lib/useForm';
import LicensePrice, { usePrice } from './LicensePrice';
import Total from '../TotalCount';
import { useFindApplication } from '../Application/Queries';
import useFindUser from '../../lib/useFindUser';
import ButtonFreeTrial from '../Buttons/ButtonFreeTrial';
import { dateNow } from '../DatePicker';
import useVat from '../../lib/useVat';
// import { CREATE_LICENSE_MUTATION } from '../License/Queries';
// import { CREATE_ORDER_MUTATION } from '../Order/Queries';
import { LicenseType } from '../Tables/LicenseType';
import { PURCHASE_LICENSE_MUTATION } from './Queries';
import { LicenseContainer } from '../styles/License';

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_AMOUNT':
      return {
        ...state,
        amount: action.amount,
        licenses: action.licenses,
        signals: action.signals,
        paymentOk: !!(action.amount > 0),
      };
    case 'SET_TRIAL':
      return {
        ...state,
        trial: action.trial,
      };
    case 'SET_DATA':
      return {
        ...state,
        purchaseData: { ...action.data },
      };
    default:
      return state;
  }
}

const initialValues = {
  monthLicense: {},
  yearLicense: {},
  monthArea: {},
  yearArea: {},
};
export default function LicenseNew({ open, onClose, appId, ownerId }) {
  const [purchaseLicense, { error }] = useMutation(PURCHASE_LICENSE_MUTATION);
  const { user, userError } = useFindUser(ownerId);
  const { application, applicationError } = useFindApplication(appId);
  const { vat } = useVat(ownerId);
  const { t } = useTranslation('license');

  const { inputs, handleChange, resetForm } = useForm(initialValues);
  const { price } = usePrice(ownerId);

  const [state, dispatch] = useReducer(reducer, {
    amount: 0,
    licenses: 0,
    signals: 0,
    trial: false,
    purchaseData: {},
    paymentOk: false,
  });

  useEffect(() => {
    if (application) {
      const okTrial = application.licenses.length === 0;
      dispatch({ type: 'SET_TRIAL', trial: okTrial });
    }
  }, [application]);

  function handleSuccess(orderId) {
    resetForm();
    onClose(orderId);
  }

  function handleError(error) {
    console.log(`error`, error);
  }

  useEffect(() => {
    const { monthLicense, yearLicense, monthArea, yearArea } = inputs;
    const pData = {
      appId,
      ownerId,
      purchaseInfo: t('new-licenses', { dt: dateNow() }),
      vatId: vat.id,
    };
    const pItems = [];
    let tot = 0;
    let nbL = 0;
    let nbS = 0;
    if (application?.licenseTypes && price?.items) {
      for (const lt of application.licenseTypes) {
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
        const newL =
          (inputs.monthLicense[lt.id] || 0) * (inputs.monthArea[lt.id] || 1) +
          (inputs.yearLicense[lt.id] || 0) * (inputs.yearArea[lt.id] || 1);
        nbL += newL;
        const nbSig = lt.perArea
          ? (inputs.monthLicense[lt.id] || 0) + (inputs.yearLicense[lt.id] || 0)
          : 0;
        nbS += nbSig;
        if (inputs.monthLicense[lt.id]) {
          pItems.push({
            licenseTypeId: lt.id,
            priceItemId: myPrice.id,
            itemName: t(`item-name-${lt.name}-monthly`),
            quantity: inputs.monthLicense[lt.id],
            nbArea: inputs.monthArea[lt.id] || 0,
            monthly: true,
          });
        }
        if (inputs.yearLicense[lt.id]) {
          pItems.push({
            licenseTypeId: lt.id,
            priceItemId: myPrice.id,
            itemName: t(`item-name-${lt.name}-yearly`),
            quantity: inputs.yearLicense[lt.id],
            nbArea: inputs.yearArea[lt.id] || 0,
            monthly: false,
          });
        }
      }
    }
    dispatch({
      type: 'UPDATE_AMOUNT',
      amount: tot,
      licenses: nbL,
      signals: nbS,
    });
    pData.expectedAmountBrut = tot;
    pData.purchaseItems = [...pItems];
    dispatch({ type: 'SET_DATA', data: pData });
  }, [inputs, appId, ownerId]);

  if (userError) return <DisplayError error={userError} />;
  if (applicationError) return <DisplayError error={applicationError} />;

  return (
    <Drawer onClose={onClose} open={open} title={t('new-licenses')}>
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
              <LicensePrice
                owner={user.id}
                licenseTypeIds={application.licenseTypes}
              />
            )}
          </Row>
          {application.licenseTypes.map((lt) => (
            <LicenseContainer key={lt.id}>
              <LicenseType license={lt.id} />
              <Separator />
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
          <Total value={state} vat={parseFloat(vat.value)} />
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonPayment
          disabled={!state.paymentOk}
          onSuccess={handleSuccess}
          onError={handleError}
          purchaseFunction={purchaseLicense}
          data={state.purchaseData}
        />
        {state.trial && (
          <ButtonFreeTrial
            ownerId={ownerId}
            appId={appId}
            onSuccess={() => onClose()}
          />
        )}
        <ButtonCancel onClick={() => onClose(null)} />
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
