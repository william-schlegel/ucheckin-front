import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import nProgress from 'nprogress';

import styled from 'styled-components';
import { CreditCard } from 'react-feather';
import { IconButtonStyles } from './ActionButton';
import { SecondaryButtonStyled } from '../styles/Button';
import Loading from '../Loading';

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const PaymentStyled = styled.div`
  display: block;
  width: 100%;
`;

export default function ButtonPayment({
  disabled,
  purchaseFunction,
  data,
  onSuccess,
  onError,
}) {
  return (
    <PaymentStyled>
      {!disabled && (
        <Elements stripe={stripeLib}>
          <PaymentForm
            onSuccess={onSuccess}
            onError={onError}
            purchaseFunction={purchaseFunction}
            data={data}
          />
        </Elements>
      )}
    </PaymentStyled>
  );
}

ButtonPayment.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  purchaseFunction: PropTypes.func,
  data: PropTypes.object,
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

function PaymentForm({ onSuccess, onError, purchaseFunction, data }) {
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
    const order = purchaseFunction({
      variables: { ...data, token: paymentMethod.id },
    });
    setLoading(false);
    nProgress.done();
    onSuccess(order.id);
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
};
