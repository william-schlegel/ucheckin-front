import gql from 'graphql-tag';

export const PAGINATION_LOCATION_QUERY = gql`
  query PAGINATION_LOCATION_QUERY {
    count: umitLocationsCount
  }
`;

export const PAGINATION_MATERIAL_QUERY = gql`
  query PAGINATION_MATERIAL_QUERY {
    count: umitMaterialsCount
  }
`;

export const ALL_LOCATIONS_QUERY = gql`
  query ALL_LOCATIONS_QUERY($skip: Int = 0, $take: Int, $where: UmitLocationWhereInput) {
    umitLocations(
      take: $take
      skip: $skip
      where: $where
      orderBy: [{ name: asc }, { company: asc }]
    ) {
      id
      name
      address
      zipCode
      city
      country
      contact
      telephone
      company
    }
  }
`;

export const LOCATION_QUERY = gql`
  query LOCATION_QUERY($id: ID!) {
    umitLocation(where: { id: $id }) {
      id
      name
      address
      zipCode
      city
      country
      contact
      telephone
      company
    }
  }
`;

export const CREATE_LOCATION_MUTATION = gql`
  mutation CREATE_LOCATION_MUTATION($data: UmitLocationCreateInput!) {
    createUmitLocation(data: $data) {
      id
    }
  }
`;

export const UPDATE_LOCATION_MUTATION = gql`
  mutation UPDATE_LOCATION_MUTATION(
    $where: UmitLocationWhereUniqueInput!
    $data: UmitLocationUpdateInput!
  ) {
    updateUmitLocation(where: $where, data: $data) {
      id
    }
  }
`;

export const DELETE_LOCATION_MUTATION = gql`
  mutation DELETE_LOCATION_MUTATION($where: UmitLocationWhereUniqueInput!) {
    deleteUmitLocation(where: $where) {
      id
    }
  }
`;
