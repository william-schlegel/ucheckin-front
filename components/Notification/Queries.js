import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($where: NotificationWhereInput) {
    count: _allNotificationsMeta(where: $where) {
      count
    }
  }
`;

export const ALL_NOTIFICATIONS_QUERY = gql`
  query ALL_NOTIFICATIONS_QUERY(
    $skip: Int = 0
    $first: Int
    $where: NotificationWhereInput
  ) {
    allNotifications(
      first: $first
      skip: $skip
      where: $where
      sortBy: startDate_DESC
    ) {
      id
      name
      owner {
        id
        name
      }
      displayName
      type
      startDate
      endDate
      application {
        id
        name
      }
      signal {
        id
        name
      }
      items {
        id
        name
        displayType
        image {
          publicUrlTransformed(transformation: { width: "200", height: "200" })
        }
      }
    }
  }
`;

export const NOTIFICATION_QUERY = gql`
  query NOTIFICATION_QUERY($id: ID!) {
    Notification(where: { id: $id }) {
      id
      name
      owner {
        id
        name
      }
      displayName
      type
      startDate
      endDate
      application {
        id
        name
      }
      signal {
        id
        name
      }
      items {
        id
        displayType
        image {
          publicUrlTransformed
        }
        imageLink
        htmlContent
        videoLink
        numberOfDisplay
        delayBetweenDisplay
        probability
        defaultNotification
        quota
      }
    }
  }
`;

export const DELETE_NOTIFICATION_MUTATION = gql`
  mutation DELETE_NOTIFICATION_MUTATION($id: ID!) {
    deleteNotification(id: $id) {
      id
      name
    }
  }
`;

export const UPDATE_NOTIFICATION_MUTATION = gql`
  mutation UPDATE_NOTIFICATION_MUTATION(
    $id: ID!
    $name: String!
    $displayName: String!
    $owner: ownerId!
    $type: String!
    $startDate: String!
    $endDate: String!
    $appId: ID!
    $signalId: ID!
    $items: NotificationItemRelateToManyInput
  ) {
    updateNotification(
      id: $id
      data: {
        name: $name
        displayName: $displayName
        owner: { connect: { id: $ownerId } }
        type: $type
        startDate: $startDate
        endDate: $endDate
        application: { connect: { id: $appId } }
        signal: { connect: { id: $signalId } }
        items: $items
      }
    ) {
      id
    }
  }
`;

export const CREATE_NOTIFICATION_MUTATION = gql`
  mutation CREATE_NOTIFICATION_MUTATION(
    $name: String!
    $displayName: String!
    $type: String!
    $startDate: String!
    $endDate: String!
    $ownerId: ID!
    $appId: ID!
    $signalId: ID!
    $items: NotificationItemRelateToManyInput
  ) {
    createNotification(
      data: {
        name: $name
        displayName: $displayName
        owner: { connect: { id: $ownerId } }
        type: $type
        startDate: $startDate
        endDate: $endDate
        application: { connect: { id: $appId } }
        signal: { connect: { id: $signalId } }
        items: $items
      }
    ) {
      id
    }
  }
`;

export function useFindNotification(notificationId) {
  const [findNotification, { data, error, loading }] = useLazyQuery(
    NOTIFICATION_QUERY
  );
  useEffect(() => {
    if (notificationId)
      findNotification({
        variables: { id: notificationId },
      });
  }, [notificationId, findNotification]);
  return {
    notification: data?.Notification || {
      id: notificationId,
    },
    notificationError: error,
    notificationLoading: loading,
  };
}
