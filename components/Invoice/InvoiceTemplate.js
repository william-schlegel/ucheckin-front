import { gql, useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import styled from 'styled-components';

import { formatMoney, formatNumber, formatPrct } from '../../lib/formatNumber';
import { formatDate } from '../DatePicker';
import DisplayError from '../ErrorMessage';
import Table from '../styles/Table';
import Image from '../Tables/Image';

const QUERY_STIMSHOP = gql`
  query QUERY_STIMSHOP($key: String!) {
    stimshops(where: { key: { equals: $key } }) {
      id
      key
      logo {
        publicUrlTransformed(transformation: { width: "800" })
      }
      city
      vatNumber
      footer
      bankDetails
    }
  }
`;

const InvoiceTemplate = forwardRef(function Template(props, ref) {
  const { t } = useTranslation('invoice');
  const { data: dataStim, error: errorStim } = useQuery(QUERY_STIMSHOP, {
    variables: { key: 'stimshop' },
  });

  if (!props.data) return null;
  if (!dataStim) return null;

  const { data } = props;
  const stim = dataStim.stimshops[0];

  if (errorStim) return <DisplayError error={errorStim} />;
  return (
    <InvoiceBody ref={ref}>
      <Image imageSrc={stim.logo.publicUrlTransformed} size={100} ratio={5} />
      <Header>
        <div className="address">
          <p>{data.owner.company}</p>
          <p>{data.owner.address}</p>
          <p>
            {data.owner.zipCode} {data.owner.city} ({data.owner.country})
          </p>
        </div>
        <div className="reference">
          <p>
            {t('attention-to')} {data.owner.name}
          </p>
          <p>
            {stim.city}, {formatDate(data.orderDate)}
          </p>
          <strong>
            {t('invoice')} : {data.number}
          </strong>
        </div>
      </Header>
      <Table>
        <thead>
          <tr>
            <th>{t('license-type')}</th>
            <th>{t('common:name')}</th>
            <th>{t('quantity')}</th>
            <th>{t('nb-area')}</th>
            <th>{t('unit-price')}</th>
            <th>{t('total-brut')}</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => (
            <tr key={item.id}>
              <td>{item.licenseType.name}</td>
              <td>{item.name}</td>
              <td className="right">{formatNumber(item.quantity)}</td>
              <td className="right">{formatNumber(item.nbArea)}</td>
              <td className="right"> {formatMoney(item.unitPrice)}</td>
              <td className="right">{formatMoney(item.unitPrice * item.quantity * item.nbArea)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Total>
        <p>
          <span>{t('total-brut')}</span>
          <strong>{formatMoney(data.totalBrut)}</strong>
        </p>
        <p>
          <span>
            {t('vat-value')} ({formatPrct(data.vatValue)})
          </span>
          <strong>{formatMoney(data.vatValue * data.totalBrut)}</strong>
        </p>
        <p className="border">
          <span>{t('total-net')}</span>
          <strong>{formatMoney(data.totalNet)}</strong>
        </p>
      </Total>
      <Footer>
        {data.paid ? (
          <div className="paid">
            {t('already-paid')} - {t('paid-the', { date: formatDate(data.paymentDate) })}
          </div>
        ) : (
          <div>
            <p>{t('for-payment')}</p>
            <p className="bank">
              <strong>{t('bank-coordinates')}</strong> : {stim.bankDetails}
            </p>
          </div>
        )}
        <div className="footer">
          <p>{t('vat-number', { vatNumber: stim.vatNumber })}</p>
          {stim.footer.split('\n').map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      </Footer>
    </InvoiceBody>
  );
});

const InvoiceBody = styled.div`
  margin: 0;
  padding: 5rem 2rem;
  /* font-size: 1.25rem; */
  height: 100%;
  display: flex;
  flex-direction: column;
  .right {
    text-align: end;
  }
  p {
    margin: 0.25rem 0;
    line-height: 1;
  }
`;

const Footer = styled.div`
  margin-top: auto;
  .footer {
    margin-top: 2rem;
    text-align: center;
  }
  .bank {
    margin: 1em;
    padding: 5px;
    border: 1px solid black;
    text-align: center;
  }
  .paid {
    font-size: 1.5em;
    text-align: center;
  }
`;

const Header = styled.div`
  .address {
    margin-left: 50%;
    margin-top: 3rem;
  }
  .reference {
    margin-left: 30%;
    margin-top: 1rem;
  }
  strong {
    font-weight: 700;
    text-transform: uppercase;
  }
`;

const Total = styled.div`
  margin-top: 2rem;
  margin-left: 50%;
  p {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 5px;
    &.border {
      border: 2px solid black;
    }
  }
`;

InvoiceTemplate.propTypes = {
  data: PropTypes.object,
};

export default InvoiceTemplate;
