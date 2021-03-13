import gql from 'graphql-tag';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    countPage: _allSignalsMeta {
      count
    }
  }
`;

export const ALL_SIGNALS_QUERY = gql`
  query ALL_SIGNALS_QUERY(
    $skip: Int = 0
    $first: Int
    $signal: String
    $owner: String
    $active: Boolean
  ) {
    allSignals(
      first: $first
      skip: $skip
      where: {
        AND: [
          { signal_contains_i: $signal }
          { owner: { name_contains_i: $owner } }
          { active: $active }
        ]
      }
    ) {
      id
      signal
      active
      validity
      owner {
        id
        name
      }
      licenses {
        id
        signal {
          id
          signal
        }
        application {
          id
          name
        }
        validity
      }
    }
  }
`;
