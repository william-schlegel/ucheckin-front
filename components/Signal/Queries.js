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

export const VALIDATE_SIGNAL_MUTATION = gql`
  mutation VALIDATE_SIGNAL_MUTATION($id: ID!, $value: Boolean!) {
    updateSignal(id: $id, data: { active: $value }) {
      id
      signal
      active
    }
  }
`;

export const SIGNAL_QUERY = gql`
  query SIGNAL_QUERY($id: ID!) {
    Signal(where: { id: $id }) {
      id
      signal
      owner {
        id
        name
      }
      active
      licenses {
        id
        application {
          id
          name
        }
        signal {
          id
          signal
        }
        validity
      }
      files {
        id
        chanel
        duration
        interval
        centralFrequency
        overlap
        gain
        url
      }
    }
  }
`;

export const MUTATION_ADD_SIGNAL_FILE = gql`
  mutation MUTATION_ADD_SIGNAL_FILE(
    $signal: ID!
    $chanel: String!
    $duration: Int
    $interval: Int
    $centralFrequency: Int
    $overlap: Int
    $gain: Int
  ) {
    createSignalFile(
      data: {
        signal: { connect: { id: $signal } }
        chanel: $chanel
        duration: $duration
        interval: $interval
        centralFrequency: $centralFrequency
        overlap: $overlap
        gain: $gain
      }
    ) {
      id
      url
    }
  }
`;
