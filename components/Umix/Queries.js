import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($where: UmixWhereInput) {
    count: umixesCount(where: $where)
  }
`;

export const ALL_UMIXES_QUERY = gql`
  query ALL_UMIXES_QUERY($skip: Int = 0, $take: Int, $where: UmixWhereInput) {
    umixes(take: $take, skip: $skip, where: $where) {
      id
      name
      description
      playlistActive
      owner {
        id
        name
      }
      status(orderBy: { modificationDate: desc }, take: 1) {
        id
        status
        modificationDate
      }
    }
  }
`;

export const CREATE_UMIX_MUTATION = gql`
  mutation CREATE_UMIX_MUTATION($data: UmixCreateInput!) {
    createUmix(data: $data) {
      id
    }
  }
`;

export const CREATE_UMIXES_MUTATION = gql`
  mutation CREATE_UMIXES_MUTATION($data: [UmixCreateInput]!) {
    createUmixes(data: $data) {
      id
    }
  }
`;

export const UPDATE_UMIX_MUTATION = gql`
  mutation UPDATE_UMIX_MUTATION($where: UmixWhereUniqueInput!, $data: UmixUpdateInput!) {
    updateUmix(where: $where, data: $data) {
      id
    }
  }
`;

export const DELETE_UMIX_MUTATION = gql`
  mutation DELETE_UMIX_MUTATION(
    $id: ID!
    $idPls: [UmixPlaylistItemWhereUniqueInput!]!
    $idStatus: [UmixStatusWhereUniqueInput!]!
  ) {
    deleteUmix(where: { id: $id }) {
      id
      name
    }
    deleteUmixPlaylistItems(where: $idPls) {
      id
    }
    deleteUmixStatuses(where: $idStatus) {
      id
    }
  }
`;

export const ACTIVATE_PLAYLIST_UMIX = gql`
  mutation ACTIVATE_PLAYLIST_UMIX($umixId: ID!, $value: Boolean!) {
    updateUmix(where: { id: $umixId }, data: { playlistActive: $value }) {
      id
      playlistActive
    }
  }
`;

export const CHANGE_STATUS_UMIX = gql`
  mutation CHANGE_STATUS_UMIX($umixId: ID!, $status: String!) {
    createUmixStatus(data: { umix: { connect: { id: $umixId } }, status: $status }) {
      id
    }
  }
`;

export const UMIX_QUERY = gql`
  query UMIX_QUERY($id: ID!) {
    umix(where: { id: $id }) {
      id
      macAddress
      name
      description
      playlistActive
      owner {
        id
        name
      }
      status(orderBy: { modificationDate: desc }) {
        id
        status
        reference
        modificationDate
      }
      playlistItems(orderBy: { playAt: desc }) {
        id
        licenseType {
          id
          name
          logo {
            publicUrlTransformed(transformation: { width: "100", height: "100" })
          }
        }
        signal {
          id
          name
        }
        playAt
        duration
      }
    }
  }
`;

export const CREATE_PLAYLIST_ITEM = gql`
  mutation CREATE_PLAYLIST_ITEM($data: UmixPlaylistItemCreateInput!) {
    createUmixPlaylistItem(data: $data) {
      id
    }
  }
`;

export function useFindUmix(umixId) {
  const [findUmix, { data, error, loading }] = useLazyQuery(UMIX_QUERY);
  useEffect(() => {
    if (umixId)
      findUmix({
        variables: { id: umixId },
      });
  }, [umixId, findUmix]);
  return {
    umix: data?.umix || {
      id: umixId,
      name: '',
    },
    umixError: error,
    umixLoading: loading,
  };
}
