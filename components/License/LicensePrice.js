import { useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { formatMoney } from '../../lib/formatNumber';
import { dateDay } from '../DatePicker';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import NoData from '../Tables/NoData';
import { LICENSE_PRICE_QUERY } from './Queries';

export function usePrice(ownerId, type) {
  const { loading, error, data } = useQuery(LICENSE_PRICE_QUERY, {
    variables: { owner: ownerId, dayDate: dateDay(), type },
  });
  const [price, setPrice] = useState({});

  useEffect(() => {
    if (data?.prices) {
      const def = data.prices.filter((p) => p.default);
      const owner = data.prices.filter((p) => p.owner.id === ownerId && !p.default);
      // if there is a special price for a user
      if (owner.length > 0) {
        setPrice(owner[0]);
        // else default price
      } else if (def.length > 0) {
        setPrice(def[0]);
      }
    }
  }, [data, ownerId]);

  return {
    loading,
    error,
    price,
  };
}

export default function LicensePrice({ owner, licenseTypeIds }) {
  const { loading, error, price } = usePrice(owner, 'license');
  const { t, lang } = useTranslation('license');

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (!price.id) return <NoData />;

  // console.log({ price, licenseTypeId });
  return (
    <>
      <TableStyled>
        <thead>
          <tr>
            <th className={price.default ? 'default' : ''}>{t('your-price')}</th>
            <th>{t('by-month')}</th>
            <th>{t('by-year')}</th>
          </tr>
        </thead>
        <tbody>
          {licenseTypeIds.map((lt) =>
            price?.items
              .filter((p) => p.licenseType?.id === lt.id)
              .map((p) => (
                <tr key={p.id}>
                  <td>{t(`common:${p.licenseType.name}`)}</td>
                  <td>{formatMoney(p.monthly, lang)}</td>
                  <td>{formatMoney(p.yearly, lang)}</td>
                </tr>
              ))
          )}
        </tbody>
      </TableStyled>
    </>
  );
}

LicensePrice.propTypes = {
  owner: PropTypes.string.isRequired,
  licenseTypeIds: PropTypes.array,
};

export const TableStyled = styled.table`
  width: 100%;
  background-color: var(--white);
  /* border: solid 1px var(--secondary); */
  border-spacing: 0;
  thead {
    color: var(--primary);
    font-size: 1.25rem;
  }
  th,
  td {
    border-bottom: solid 1px var(--secondary);
    border-right: solid 1px var(--secondary);
    padding: 10px 5px;
    &.default {
      color: var(--secondary);
    }
  }
  tbody > tr {
    & > td {
      text-align: right;
    }
    & > td:first-child {
      text-align: left;
      color: var(--primary);
      font-size: 1.25rem;
    }
  }
`;
