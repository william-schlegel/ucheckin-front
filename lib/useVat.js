import { useLazyQuery, useQuery } from '@apollo/client';
import gql from 'graphql-tag';

import { useEffect } from 'react';
import { dateDay } from '../components/DatePicker';
import { QUERY_PROFILE } from '../components/User/Queries';

const FIND_VAT_QUERY = gql`
  query FIND_VAT_QUERY($country: String!, $now: String!) {
    vats(
      where: {
        country: $country
        dateStart_lte: $now
        OR: [{ dateEnd: null }, { dateEnd_gt: $now }]
      }
      orderBy: { dateStart: desc }
    ) {
      id
      value
    }
  }
`;

export default function useVat(userId) {
  const { data: user } = useQuery(QUERY_PROFILE, { variables: { id: userId } });
  const country = user?.User.country;
  const [findVat, { data, error, loading }] = useLazyQuery(FIND_VAT_QUERY);

  // console.log(`useVat - user`, user);
  // console.log(`useVat - country`, country);
  // console.log(`useVat - data`, data);

  useEffect(() => {
    if (country)
      findVat({
        variables: { country, now: dateDay() },
      });
  }, [country, findVat]);

  return {
    vat: data?.vats[0] || { value: 0 },
    vatError: error,
    vatLoading: loading,
  };
}
