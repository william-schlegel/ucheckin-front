import { useMutation, useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useReducer } from 'react';
import Select from 'react-select';

import useFindUser from '../../lib/useFindUser';
import useForm from '../../lib/useForm';
import useVat from '../../lib/useVat';
import { useFindApplication } from '../Application/Queries';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonFreeTrial from '../Buttons/ButtonFreeTrial';
import ButtonPayment from '../Buttons/ButtonPayment';
import Counter from '../Counter';
import { dateNow } from '../DatePicker';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import { OWNER_SIGNALS_QUERY } from '../Signal/Queries';
import { Block, Form, FormBodyFull, H3, Label, Row, RowReadOnly, Separator } from '../styles/Card';
import { LicenseContainer } from '../styles/License';
import selectTheme from '../styles/selectTheme';
import { LicenseType } from '../Tables/LicenseType';
import { TotalLicenses } from '../TotalCount';
import LicensePrice, { usePrice } from './LicensePrice';
import { PURCHASE_LICENSE_MUTATION } from './Queries';

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
    case 'SET_INVOICING_MODE':
      return {
        ...state,
        invoicingModel: action.invoicingModel,
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
  nbSignal: {},
  monthLicense: {},
  yearLicense: {},
  nbArea: {},
  signalId: '',
};
export default function LicenseNew({ open, onClose, appId, ownerId, withSignal }) {
  const [purchaseLicense, { error }] = useMutation(PURCHASE_LICENSE_MUTATION);
  const { data: signalData } = useQuery(OWNER_SIGNALS_QUERY, { variables: { ownerId } });
  const { user, userError } = useFindUser(ownerId);
  const { application, applicationError } = useFindApplication(appId);
  const { vat } = useVat(ownerId);
  const { t } = useTranslation('license');

  const { inputs, handleChange, resetForm } = useForm(initialValues);
  const { price } = usePrice(ownerId, 'license');

  const [state, dispatch] = useReducer(reducer, {
    amount: 0,
    licenses: 0,
    signals: 0,
    trial: false,
    invoicingModel: 'online',
    purchaseData: {},
    paymentOk: false,
  });

  useEffect(() => {
    if (user) {
      dispatch({ type: 'SET_INVOICING_MODE', invoicingModel: user.invoicingModel });
    }
  }, [user]);

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
    console.error(`error`, error);
  }

  useEffect(() => {
    const { nbSignal, monthLicense, yearLicense, signalId } = inputs;
    const pData = {
      appId,
      ownerId,
      purchaseInfo: t('new-licenses', { dt: dateNow() }),
      vatId: vat.id,
      nbSignal,
      signalId,
    };
    const pItems = [];
    let tot = 0;
    let nbL = 0;
    let nbS = 0;
    let nbA = 0;
    if (application?.licenseTypes && price?.items) {
      for (const lt of application.licenseTypes) {
        const myPrice = price.items.filter((p) => p.licenseType.id === lt.id)[0];
        const licensePrice =
          parseInt(monthLicense[lt.id] || 0) * parseFloat(myPrice.monthly) +
          parseInt(yearLicense[lt.id] || 0) * parseFloat(myPrice.yearly);
        if (licensePrice) {
          if (signalId) nbS += 1;
          else nbS += parseInt(inputs.nbSignal[lt.id]) || 0;
          nbA += parseInt(inputs.nbArea[lt.id]) || 0;
          const newL = lt.perArea ? nbS * nbA : 1;
          nbL += newL;
          tot += newL * licensePrice;
          const monthly = !!inputs.monthLicense[lt.id];
          pItems.push({
            licenseTypeId: lt.id,
            priceItemId: myPrice.id,
            itemName: t(`item-name-${lt.name}-${monthly ? 'monthly' : 'yearly'}`),
            quantity: monthly ? inputs.monthLicense[lt.id] : inputs.yearLicense[lt.id],
            monthly,
            nbSignal: nbS,
            nbArea: nbA || 1,
          });
        }
      }
    }
    dispatch({
      type: 'UPDATE_AMOUNT',
      amount: tot,
      areas: nbA,
      signals: nbS,
      licenses: nbL,
    });
    pData.expectedAmountBrut = tot;
    pData.purchaseItems = [...pItems];
    dispatch({ type: 'SET_DATA', data: pData });
  }, [inputs, appId, ownerId]);

  function getSignal() {
    const sig = signalData.signals.find((s) => s.id === inputs.signal);
    if (sig) return { value: sig.id, label: sig.name };
  }

  if (userError) return <DisplayError error={userError} />;
  if (applicationError) return <DisplayError error={applicationError} />;

  // console.log(`inputs.signalId`, inputs.signalId);

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
            {user?.id && <LicensePrice owner={user.id} licenseTypeIds={application.licenseTypes} />}
          </Row>
          {application.licenseTypes.map((lt) => (
            <LicenseContainer key={lt.id}>
              <LicenseType license={lt.id} />
              {lt.perArea && (
                <div style={{ marginLeft: '0.5em' }}>
                  {withSignal ? (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <Label>{t('signal')}</Label>
                      <Select
                        theme={selectTheme}
                        className="select"
                        value={getSignal()}
                        onChange={(e) =>
                          handleChange({
                            value: e.value,
                            name: 'signalId',
                          })
                        }
                        options={signalData.signals.map((s) => ({ value: s.id, label: s.name }))}
                      />
                    </div>
                  ) : (
                    <Counter
                      label={t('nb-signal')}
                      name={`nbSignal.${lt.id}`}
                      input={inputs.nbSignal[lt.id] || 0}
                      handleChange={handleChange}
                    />
                  )}
                  <Counter
                    label={t('nb-area')}
                    name={`nbArea.${lt.id}`}
                    input={inputs.nbArea[lt.id] || 0}
                    handleChange={handleChange}
                    min={1}
                  />
                </div>
              )}
              <Separator />
              <FormBodyFull>
                <Row>
                  <H3>{t('nb-license')}</H3>
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
              </FormBodyFull>
            </LicenseContainer>
          ))}
          <TotalLicenses value={state} vat={parseFloat(vat.value)} />
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonPayment
          disabled={!state.paymentOk}
          onSuccess={handleSuccess}
          onError={handleError}
          purchaseFunction={purchaseLicense}
          data={state.purchaseData}
          invoicingModel={state.invoicingModel}
        />
        {state.trial && (
          <ButtonFreeTrial ownerId={ownerId} appId={appId} onSuccess={() => onClose()} />
        )}
        <ButtonCancel onClick={() => onClose(null)} />
      </DrawerFooter>
      {error && <DisplayError error={error} />}
    </Drawer>
  );
}

LicenseNew.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  appId: PropTypes.string,
  ownerId: PropTypes.string,
  withSignal: PropTypes.bool,
};
