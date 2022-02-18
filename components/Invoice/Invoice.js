import { useQuery } from '@apollo/client';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import styled from 'styled-components';

import ButtonBack from '../Buttons/ButtonBack';
import { formatDate } from '../DatePicker';
import Loading from '../Loading';
import {
  Form,
  FormBody,
  FormBodyFull,
  FormHeader,
  FormTitle,
  Label,
  Row,
  RowReadOnly,
} from '../styles/Card';
import { LicenseType } from '../Tables/LicenseType';
import Number from '../Tables/Number';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';
import { TotalLicenses } from '../TotalCount';
import InvoiceTemplate from './InvoiceTemplate';
import { ORDER_QUERY } from './Queries';

const Canceled = styled.span`
  margin: 0 1rem 0 auto !important;
  background-color: 'red';
  padding: 0.5rem 2rem;
  color: 'yellow' !important;
  border-radius: 3px;
`;

const Paid = styled.span`
  color: ${(props) => (props.paid ? 'green' : 'red')} !important;
`;

export default function Invoice({ id, backButton, print, setPrint }) {
  const { loading, data } = useQuery(ORDER_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('invoice');
  const columns = useColumns(
    [
      [
        t('license-type'),
        'licenseType.id',
        ({ cell: { value } }) => <LicenseType license={value} />,
      ],
      [t('common:name'), 'name'],
      [t('quantity'), 'quantity', ({ cell: { value } }) => <Number value={value} />],
      [t('nb-area'), 'nbArea', ({ cell: { value } }) => <Number value={value} />],
      [t('unit-price'), 'unitPrice', ({ cell: { value } }) => <Number value={value} money />],
    ],
    false
  );
  const printRef = useRef();
  const handlePrintInvoice = useReactToPrint({ content: () => printRef.current });

  useEffect(() => {
    if (print) {
      handlePrintInvoice();
      setPrint(false);
    }
  }, [print, handlePrintInvoice, setPrint]);

  if (loading) return <Loading />;
  if (!data) return null;
  return (
    <>
      <Head>
        <title>
          UCheck In - {t('invoice')} {data.order.number}
        </title>
      </Head>
      {print && <InvoiceTemplate data={data.order} ref={printRef} />}
      <Form>
        <FormHeader>
          <FormTitle>
            {t('invoice')} <span>{data.order.number}</span>
            {data.order.canceled && <Canceled>{t('canceled')}</Canceled>}
            <Paid paid={data.order.paid}>
              {data.order.paid
                ? t('paid-the', { date: formatDate(data.order.paymentDate) })
                : t('not-paid')}
            </Paid>
          </FormTitle>
          {backButton && <ButtonBack route="/invoices" label={t('navigation:invoices')} />}
        </FormHeader>
        <FormBody>
          <RowReadOnly>
            <Label>{t('invoice-date')}</Label>
            <ValidityDate value={data.order.orderDate} noColor />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('user')}</Label>
            <span>{data.order.owner.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('company')}</Label>
            <span>{data.order.owner.company}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('address')}</Label>
            <span>{data.order.owner.address}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('zip-code')}</Label>
            <span>{data.order.owner.zipCode}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('city')}</Label>
            <span>{data.order.owner.city}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('country')}</Label>
            <span>{data.order.owner.country}</span>
          </RowReadOnly>
        </FormBody>
        <FormBodyFull>
          <Row>
            <Table columns={columns} data={data.order.items} />
          </Row>
          <TotalLicenses
            vat={parseFloat(data.order.vatValue)}
            value={{ amount: parseFloat(data.order.totalBrut) }}
          />
        </FormBodyFull>
      </Form>
    </>
  );
}

Invoice.propTypes = {
  id: PropTypes.string.isRequired,
  backButton: PropTypes.bool,
};
