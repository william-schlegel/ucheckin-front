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
import gql from 'graphql-tag';

import { useMutation } from '@apollo/client';
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
  amount,
  onSuccess,
  onError,
}) {
  return (
    <PaymentStyled>
      {!disabled && (
        <Elements stripe={stripeLib}>
          <PaymentForm
            amount={amount}
            onSuccess={onSuccess}
            onError={onError}
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
  amount: PropTypes.number,
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

const CREATE_PAYMENT = gql`
  mutation CREATE_PAYMENT($token: String!, $amount: Float!) {
    checkout(token: $token, amount: $amount) {
      charge
    }
  }
`;

function PaymentForm({ amount, onSuccess, onError }) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation('common');

  const [checkout, { error: graphQLError }] = useMutation(CREATE_PAYMENT);

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
    const variables = {
      token: paymentMethod.id,
      amount: amount * 100, // in cents
    };
    console.log(`variables`, variables);
    const charge = await checkout({
      variables,
    });
    setLoading(false);
    nProgress.done();
    onSuccess();
  }

  return (
    <CheckoutFormStyles>
      {error && <p style={{ fontSize: 12 }}>{error.message}</p>}
      {graphQLError && <p style={{ fontSize: 12 }}>{graphQLError.message}</p>}
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
  amount: PropTypes.number,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};
