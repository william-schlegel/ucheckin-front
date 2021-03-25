import { useLazyQuery, useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { useEffect } from 'react';
import { dateNow } from '../components/DatePicker';
import { QUERY_PROFILE } from '../components/Profile/Profile';

const FIND_VAT_QUERY = gql`
  query FIND_VAT_QUERY($country: String!, $now: String!) {
    allVats(
      where: {
        country: $country
        dateStart_lte: $now
        OR: [{ dateEnd: null }, { dateEnd_gt: $now }]
      }
    ) {
      value
    }
  }
`;

export default function useVat(userId) {
  const { data: user } = useQuery(QUERY_PROFILE, { variables: { id: userId } });
  const country = user?.country;
  const [findVat, { data, error, loading }] = useLazyQuery(FIND_VAT_QUERY);
  useEffect(() => {
    if (country)
      findVat({
        variables: { country, now: dateNow() },
      });
  }, [country, findVat]);

  return {
    vat: data?.allVats || { value: 0.2 },
    vatError: error,
    vatLoading: loading,
  };
}
