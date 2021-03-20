import { useLazyQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import formatMoney from '../../lib/formatMoney';
import { LICENSE_PRICE_QUERY } from './Queries';

const TableStyled = styled.table`
  width: 100%;
  background-color: var(--white);
  /* border: solid 1px var(--pink); */
  border-spacing: 0;
  thead {
    color: var(--blue);
    font-size: 1.25rem;
  }
  th,
  td {
    border-bottom: solid 1px var(--pink);
    border-right: solid 1px var(--pink);
    padding: 10px 5px;
    .default {
      color: var(--pink);
    }
  }
  tbody > tr {
    & > td {
      text-align: right;
    }
    & > td:first-child {
      text-align: left;
      color: var(--blue);
      font-size: 1.25rem;
    }
  }
`;

export function usePrice(ownerId) {
  const [loadPrice, { loading, error, data }] = useLazyQuery(
    LICENSE_PRICE_QUERY
  );
  const [price, setPrice] = useState({});

  useEffect(() => {
    const dayDate = new Date().toISOString();
    if (ownerId) {
      loadPrice({
        variables: { owner: ownerId, dayDate },
      });
    }
  }, [ownerId, loadPrice]);

  useEffect(() => {
    if (data?.prices) {
      const def = data.prices.filter((p) => p.default);
      const owner = data.prices.filter(
        (p) => p.owner.id === ownerId && !p.default
      );
      if (owner.length > 0) {
        setPrice(owner[0]);
      } else if (def.length > 0) {
        setPrice(def[0]);
      }
    }
  }, [data, ownerId]);

  return { loading, error, price };
}

export default function LicensePrice({ owner }) {
  const { loading, error, price } = usePrice(owner);
  const { t, lang } = useTranslation('license');

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (!price) return <p>No data</p>;
  return (
    <>
      <TableStyled>
        <thead>
          <tr>
            <th className={price.default ? 'default' : ''}>
              {t('your-price')}
            </th>
            <th>{t('by-month')}</th>
            <th>{t('by-year')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t('common:ucheck-in')}</td>
            <td>{formatMoney(price.ucheckInMonthly, lang)}</td>
            <td>{formatMoney(price.ucheckInYearly, lang)}</td>
          </tr>
          <tr>
            <td>{t('common:wi-us')}</td>
            <td>{formatMoney(price.wiUsMonthly, lang)}</td>
            <td>{formatMoney(price.wiUsMonthly, lang)}</td>
          </tr>
        </tbody>
      </TableStyled>
    </>
  );
}

LicensePrice.propTypes = {
  owner: PropTypes.string.isRequired,
};
