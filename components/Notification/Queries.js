import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($where: NotificationWhereInput) {
    count: notificationsCount(where: $where)
  }
`;

export const ALL_NOTIFICATIONS_QUERY = gql`
  query ALL_NOTIFICATIONS_QUERY($skip: Int = 0, $take: Int, $where: NotificationWhereInput) {
    notifications(take: $take, skip: $skip, where: $where, orderBy: { startDate: desc }) {
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
      event {
        id
        name
      }
      icon {
        publicUrlTransformed(transformation: { width: "200", height: "200" })
      }
      items {
        id
        name
        displayType
        icon {
          publicUrlTransformed(transformation: { width: "200", height: "200" })
        }
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
      event {
        id
        name
      }
      icon {
        publicUrlTransformed(transformation: { width: "200", height: "200" })
      }
      delayBetweenDisplay
      items {
        icon {
          publicUrlTransformed(transformation: { width: "200", height: "200" })
        }

        id
        displayType
        image {
          publicUrlTransformed(transformation: { width: "200", height: "400" })
        }
        imageLink
        icon {
          publicUrlTransformed(transformation: { width: "200", height: "200" })
        }
        htmlContent {
          document
        }
        videoLink
        numberOfDisplay
        probability
        defaultNotification
        quota
        remainingQuota
      }
    }
  }
`;

export const DELETE_NOTIFICATION_MUTATION = gql`
  mutation DELETE_NOTIFICATION_MUTATION($id: ID!) {
    deleteNotification(where: { id: $id }) {
      id
      name
    }
  }
`;

export const UPDATE_NOTIFICATION_MUTATION = gql`
  mutation UPDATE_NOTIFICATION_MUTATION($id: ID!, $data: NotificationUpdateInput!) {
    updateNotification(where: { id: $id }, data: $data) {
      id
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

export const CREATE_NOTIFICATION_ITEM = gql`
  mutation CREATE_NOTIFICATION_ITEM($data: NotificationItemCreateInput!) {
    createNotificationItem(data: $data) {
      id
      displayType
      image {
        publicUrlTransformed
      }
      htmlContent {
        document
      }
      videoLink
      numberOfDisplay
      probability
      defaultNotification
      quota
    }
  }
`;

export const UPDATE_NOTIFICATION_ITEM = gql`
  mutation UPDATE_NOTIFICATION_ITEM($id: ID!, $data: NotificationItemUpdateInput!) {
    updateNotificationItem(where: { id: $id }, data: $data) {
      id
      displayType
      image {
        publicUrlTransformed
      }
      htmlContent {
        document
      }

      videoLink
      numberOfDisplay
      probability
      defaultNotification
      quota
    }
  }
`;

export const DELETE_NOTIFICATION_ITEM = gql`
  mutation DELETE_NOTIFICATION_ITEM($id: ID!) {
    deleteNotificationItem(where: { id: $id }) {
      id
    }
  }
`;

export function useFindNotification(notificationId) {
  const [findNotification, { data, error, loading }] = useLazyQuery(NOTIFICATION_QUERY);
  useEffect(() => {
    if (notificationId)
      findNotification({
        variables: { id: notificationId },
      });
  }, [notificationId, findNotification]);
  return {
    notification: data?.notification || {
      id: notificationId,
    },
    notificationError: error,
    notificationLoading: loading,
  };
}
