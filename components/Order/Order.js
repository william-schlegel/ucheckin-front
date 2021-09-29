import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { useQuery } from '@apollo/client';

import styled from 'styled-components';
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
import { ORDER_QUERY } from './Queries';
import ValidityDate from '../Tables/ValidityDate';
import Table, { useColumns } from '../Tables/Table';
import Number from '../Tables/Number';
import { LicenseType } from '../Tables/LicenseType';
import Total from '../TotalCount';
import ButtonBack from '../Buttons/ButtonBack';

const Canceled = styled.span`
  margin: 0 1rem 0 auto !important;
  background-color: red;
  padding: 0.5rem 2rem;
  color: yellow !important;
  border-radius: 3px;
`;

export default function Order({ id, backButton }) {
  const { loading, data } = useQuery(ORDER_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('order');
  const columns = useColumns(
    [
      [
        t('license-type'),
        'licenseType.id',
        ({ cell: { value } }) => <LicenseType license={value} />,
      ],
      [t('common:name'), 'name'],
      [
        t('quantity'),
        'quantity',
        ({ cell: { value } }) => <Number value={value} />,
      ],
      [
        t('nb-area'),
        'nbArea',
        ({ cell: { value } }) => <Number value={value} />,
      ],
      [
        t('unit-price'),
        'unitPrice',
        ({ cell: { value } }) => <Number value={value} money />,
      ],
    ],
    false
  );

  if (loading) return <Loading />;
  if (!data) return null;
  return (
    <Form>
      <FormHeader>
        <FormTitle>
          {t('order')} <span>{data.order.number}</span>
          {data.order.canceled && <Canceled>{t('canceled')}</Canceled>}
        </FormTitle>
        {backButton && (
          <ButtonBack route="/orders" label={t('navigation:orders')} />
        )}
      </FormHeader>
      <FormBody>
        <RowReadOnly>
          <Label>{t('order-date')}</Label>
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
        <Total
          vat={parseFloat(data.order.vatValue)}
          value={{ amount: parseFloat(data.order.totalBrut) }}
        />
      </FormBodyFull>
    </Form>
  );
}

Order.propTypes = {
  id: PropTypes.string.isRequired,
  backButton: PropTypes.bool,
};
