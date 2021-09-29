import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($where: NotificationWhereInput) {
    count: notificationsCount(where: $where)
  }
`;

export const ALL_NOTIFICATIONS_QUERY = gql`
  query ALL_NOTIFICATIONS_QUERY(
    $skip: Int = 0
    $take: Int
    $where: NotificationWhereInput
  ) {
    notifications(
      take: $take
      skip: $skip
      where: $where
      orderBy: { startDate: desc }
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
        #   image {
        #     publicUrlTransformed(transformation: { width: "200", height: "200" })
        #   }
      }
    }
  }
`;

export const NOTIFICATION_QUERY = gql`
  query NOTIFICATION_QUERY($id: ID!) {
    notification(where: { id: $id }) {
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
          publicUrlTransformed(transformation: { width: "200", height: "400" })
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
    $name: String
    $displayName: String
    $type: String
    $startDate: String
    $endDate: String
    $owner: UserRelateToOneInput
    $application: ApplicationRelateToOneInput
    $signal: SignalRelateToOneInput
  ) {
    updateNotification(
      id: $id
      data: {
        name: $name
        displayName: $displayName
        owner: $owner
        type: $type
        startDate: $startDate
        endDate: $endDate
        application: $application
        signal: $signal
      }
    ) {
      id
    }
  }
`;

export const CREATE_NOTIFICATION_MUTATION = gql`
  mutation CREATE_NOTIFICATION_MUTATION(
    $name: String!
    $displayName: String
    $type: String
    $startDate: String
    $endDate: String
    $owner: UserRelateToOneInput
    $application: ApplicationRelateToOneInput
    $signal: SignalRelateToOneInput
  ) {
    createNotification(
      data: {
        name: $name
        displayName: $displayName
        owner: $owner
        type: $type
        startDate: $startDate
        endDate: $endDate
        application: $application
        signal: $signal
      }
    ) {
      id
    }
  }
`;

export const CREATE_NOTIFICATION_ITEM = gql`
  mutation CREATE_NOTIFICATION_ITEM($data: NotificationItemCreateInput) {
    createNotificationItem(data: $data) {
      id
      displayType
      image {
        publicUrlTransformed
      }
      probability
      defaultNotification
      quota
    }
  }
`;

export const UPDATE_NOTIFICATION_ITEM = gql`
  mutation UPDATE_NOTIFICATION_ITEM(
    $id: ID!
    $data: NotificationItemUpdateInput
  ) {
    updateNotificationItem(id: $id, data: $data) {
      id
      displayType
      image {
        publicUrlTransformed
      }
      probability
      defaultNotification
      quota
    }
  }
`;

export const DELETE_NOTIFICATION_ITEM = gql`
  mutation DELETE_NOTIFICATION_ITEM($id: ID!) {
    deleteNotificationItem(id: $id) {
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
