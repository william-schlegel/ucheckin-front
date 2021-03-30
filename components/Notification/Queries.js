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
        image
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

export const CREATE_NOTIFICATION_MUTATION = gql`
  mutation CREATE_NOTIFICATION_MUTATION($data: NotificationCreateInput!) {
    createNotification(data: $data) {
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
