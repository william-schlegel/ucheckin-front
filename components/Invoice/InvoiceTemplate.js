import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import styled from 'styled-components';

import { formatMoney, formatNumber, formatPrct } from '../../lib/formatNumber';
import { formatDate } from '../DatePicker';
import Table from '../styles/Table';
import Image from '../Tables/Image';

const InvoiceTemplate = forwardRef(function Template(props, ref) {
  const { t } = useTranslation('invoice');

  if (!props.data) return null;
  const { data } = props;
  return (
    <InvoiceBody ref={ref}>
      <Image imageSrc="/images/stimshop.png" size={100} ratio={557 / 121} />
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
          <p>Paris, {formatDate(data.orderDate)}</p>
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
              <td className="right">
                {' '}
                {formatMoney(item.unitPrice * item.quantity * item.nbArea)}
              </td>
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
              <strong>{t('bank-coordinates')}</strong> : BANQUE POPULAIRE - IBAN FR76 1020 7009 9922
              2108 9500 526
            </p>
          </div>
        )}
        <div className="footer">
          <p>{t('vat-number', { vatNumber: 'FR 55 793 966 128' })}</p>
          <p>STIMSHOP - 3B rue Taylor - CS20004 - 75481 Paris Cedex 10</p>
          <p>Tél.: +33 (0)1 85 64 10 63 - www.wi-us.eu - contact@stimshop.com</p>
          <p>SAS au Capital de 163.100 € - RCS Paris 793 966 128 - NAF 7311Z</p>
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
