import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($where: SignalWhereInput) {
    count: signalsCount(where: $where)
  }
`;

export const ALL_SIGNALS_QUERY = gql`
  query ALL_SIGNALS_QUERY($skip: Int = 0, $take: Int, $where: SignalWhereInput) {
    signals(take: $take, skip: $skip, where: $where) {
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
      applications: licenses {
        application {
          id
          name
        }
      }
      notification {
        id
        name
        displayName
      }
    }
  }
`;

export const OWNER_SIGNALS_QUERY = gql`
  query OWNER_SIGNALS_QUERY($ownerId: ID) {
    signals(where: { owner: { id: { equals: $ownerId } } }) {
      id
      name
      active
    }
  }
`;

export const VALIDATE_SIGNAL_MUTATION = gql`
  mutation VALIDATE_SIGNAL_MUTATION($id: ID!, $value: Boolean!) {
    updateSignal(where: { id: $id }, data: { active: $value }) {
      id
      name
      active
    }
  }
`;

export const SIGNAL_QUERY = gql`
  query SIGNAL_QUERY($id: ID!) {
    signal(where: { id: $id }) {
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
        fileName
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
    $url: String!
    $fileName: String!
    $urlAtom: String!
    $fileNameAtom: String!
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
        url: $url
        fileName: $fileName
        urlAtom: $urlAtom
        fileNameAtom: $fileNameAtom
      }
    ) {
      id
      url
      fileName
      urlAtom
      fileNameAtom
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
    signal: data?.signal || {
      id: signalId,
      name: '',
    },
    signalError: error,
    signalLoading: loading,
  };
}
