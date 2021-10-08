import gql from 'graphql-tag';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($where: SignalDetectionWhereInput) {
    count: signalDetectionsCount(where: $where)
  }
`;

export const ALL_STATISTICS_QUERY = gql`
  query ALL_STATISTICS_QUERY($skip: Int = 0, $take: Int, $where: SignalDetectionWhereInput) {
    statistics: signalDetections(take: $take, skip: $skip, where: $where, orderBy: { date: desc }) {
      id
      date
      os
      model
      version
      chanel
      application {
        id
        name
      }
      signal {
        id
        name
      }
    }
  }
`;

export const STATISTIC_QUERY = gql`
  query STATISTIC_QUERY($id: ID!) {
    statistic: signalDetection(where: { id: $id }) {
      id
      date
      os
      model
      version
      chanel
      application {
        id
        name
      }
      signal {
        id
        name
      }
    }
  }
`;
