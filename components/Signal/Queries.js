import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($where: SignalWhereInput) {
    count: _allSignalsMeta(where: $where) {
      count
    }
  }
`;

export const ALL_SIGNALS_QUERY = gql`
  query ALL_SIGNALS_QUERY(
    $skip: Int = 0
    $first: Int
    $where: SignalWhereInput
  ) {
    allSignals(first: $first, skip: $skip, where: $where) {
      id
      name
      active
      owner {
        id
        name
      }
      licenses {
        id
        licenseType {
          id
        }
        signal {
          id
          name
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
      name
      active
    }
  }
`;

export const SIGNAL_QUERY = gql`
  query SIGNAL_QUERY($id: ID!) {
    Signal(where: { id: $id }) {
      id
      name
      owner {
        id
        name
      }
      active
      licenses {
        id
        licenseType {
          id
        }
        application {
          id
          name
        }
        signal {
          id
          name
        }
        validity
        nbArea
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

export const CREATE_SIGNAL_MUTATION = gql`
  mutation CREATE_SIGNAL_MUTATION($ownerId: ID!) {
    createSignal(data: { owner: { connect: { id: $ownerId } } }) {
      id
      name
    }
  }
`;

export const CREATE_SIGNALS_MUTATION = gql`
  mutation CREATE_SIGNALS_MUTATION($data: [SignalsCreateInput]!) {
    createSignals(data: $data) {
      id
      name
    }
  }
`;

export function useFindSignal(signalId) {
  const [findSignal, { data, error, loading }] = useLazyQuery(SIGNAL_QUERY);
  useEffect(() => {
    if (signalId)
      findSignal({
        variables: { id: signalId },
      });
  }, [signalId, findSignal]);
  return {
    signal: data?.Signal || {
      id: signalId,
      name: '',
    },
    signalError: error,
    signalLoading: loading,
  };
}
