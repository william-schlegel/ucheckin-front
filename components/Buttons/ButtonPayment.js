import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import useTranslation from 'next-translate/useTranslation';
import nProgress from 'nprogress';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { CreditCard, DollarSign } from 'react-feather';
import styled from 'styled-components';

import Loading from '../Loading';
import { SecondaryButtonStyled } from '../styles/Button';
import { IconButtonStyles } from './ActionButton';

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const PaymentStyled = styled.div`
  display: block;
  width: 100%;
`;

export default function ButtonPayment({
  disabled,
  purchaseFunction,
  data,
  onSuccess = () => console.log('Success'),
  onError = (error) => console.error(error),
  validationFunction,
  invoicingModel,
}) {
  const { t } = useTranslation('common');

  if (invoicingModel === 'invoice') {
    if (disabled) return null;
    return (
      <PaymentStyled>
        <SecondaryButtonStyled
          type="button"
          onClick={() => {
            let paymentData = data;
            if (typeof validationFunction === 'function') {
              paymentData = validationFunction();
              if (!paymentData) {
                onError(t('data-error'));
                return;
              }
            }
            purchaseFunction({ variables: { ...paymentData, token: 'invoice' } });
            if (typeof onSuccess === 'function') onSuccess();
          }}
        >
          <IconButtonStyles>
            <DollarSign size={24} />
          </IconButtonStyles>
          {t('invoice')}
        </SecondaryButtonStyled>
      </PaymentStyled>
    );
  }

  return (
    <PaymentStyled>
      {!disabled && (
        <Elements stripe={stripeLib}>
          <PaymentForm
            onSuccess={onSuccess}
            onError={onError}
            purchaseFunction={purchaseFunction}
            data={data}
            validationFunction={validationFunction}
          />
        </Elements>
      )}
    </PaymentStyled>
  );
}

ButtonPayment.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  disabled: PropTypes.bool,
  purchaseFunction: PropTypes.func,
  validationFunction: PropTypes.func,
  data: PropTypes.object,
  invoicingModel: PropTypes.string,
};

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
  margin: 0.5rem 0;
  width: 100%;
`;

function PaymentForm({ onSuccess, onError, purchaseFunction, data, validationFunction }) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation('common');

  async function proceedPayment() {
    setLoading(true);
    nProgress.start();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    if (error) {
      setError(error);
      nProgress.done();
      onError();
      return;
    }
    let paymentData = data;
    if (typeof validationFunction === 'function') {
      paymentData = validationFunction();
      if (!paymentData) {
        onError(t('data-error'));
        return;
      }
    }

    const order = purchaseFunction({
      variables: { ...paymentData, token: paymentMethod.id },
    });
    setLoading(false);
    nProgress.done();
    if (typeof onSuccess === 'function') onSuccess(order.id);
  }

  return (
    <CheckoutFormStyles>
      {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
      <CardElement />
      {loading && <Loading />}
      <SecondaryButtonStyled type="button" onClick={proceedPayment}>
        <IconButtonStyles>
          <CreditCard size={24} />
        </IconButtonStyles>
        {t('payment')}
      </SecondaryButtonStyled>
    </CheckoutFormStyles>
  );
}

PaymentForm.propTypes = {
  purchaseFunction: PropTypes.func,
  data: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  validationFunction: PropTypes.func,
};
