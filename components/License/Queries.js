import gql from 'graphql-tag';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    count: _allLicensesMeta {
      count
    }
  }
`;

export const ALL_LICENSES_QUERY = gql`
  query ALL_LICENSES_QUERY($skip: Int = 0, $first: Int, $ownerId: ID) {
    allLicenses(
      first: $first
      skip: $skip
      where: { owner: { id: $ownerId } }
    ) {
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
      valid
      owner {
        id
        name
      }
      trialLicense
      purchaseBy {
        id
      }
    }
  }
`;

export const VALIDATE_LICENSE_MUTATION = gql`
  mutation VALIDATE_LICENSE_MUTATION($id: ID!, $newDate: String!) {
    updateLicense(id: $id, data: { validity: $newDate }) {
      id
      license
      valid
    }
  }
`;

export const LICENSE_QUERY = gql`
  query LICENSE_QUERY($id: ID!) {
    License(where: { id: $id }) {
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
      valid
      purchaseDate
      purchaseInformation
      trialLicense {
        id
      }
      purchaseBy {
        id
        name
      }
      owner {
        id
        name
      }
    }
  }
`;

export const ACTIVATE_TRIAL_MUTATION = gql`
  mutation ACTIVATE_TRIAL_MUTATION($ownerId: ID!, $dateValidite: String!) {
    createLicense(
      data: {
        owner: { connect: { id: $ownerId } }
        trialLicense: true
        validity: $dateValidite
        purchaseInformation: "Trial"
        purchaseBy: { connect: { id: $ownerId } }
      }
    ) {
      id
    }
  }
`;
