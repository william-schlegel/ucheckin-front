import gql from 'graphql-tag';

export const QUERY_APPLICATION = gql`
  query QUERY_APPLICATION($id: ID!) {
    Application(where: { id: $id }) {
      name
      apiKey
      owner {
        id
        name
      }
      users {
        id
        name
      }
      licenseType
      validity
      licenses {
        id
        validity
        application {
          id
          name
        }
        signal {
          id
          signal
        }
      }
    }
  }
`;

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    countPage: _allApplicationsMeta {
      count
    }
  }
`;

export const ALL_APPLICATIONS_QUERY = gql`
  query ALL_APPLICATIONS_QUERY($skip: Int = 0, $first: Int) {
    allApplications(first: $first, skip: $skip) {
      id
      name
      apiKey
      licenseType
      validity
      owner {
        id
        name
      }
      users {
        id
        name
      }
      licenses {
        id
        signal {
          id
          signal
        }
        validity
      }
    }
  }
`;

export const CREATE_APPLICATION_MUTATION = gql`
  mutation CREATE_APPLICATION_MUTATION($name: String!) {
    createApplication(data: { name: $name }) {
      id
    }
  }
`;

export const DELETE_APPLICATION_MUTATION = gql`
  mutation DELETE_APPLICATION_MUTATION($id: ID!) {
    deleteApplication(id: $id) {
      id
      name
    }
  }
`;
