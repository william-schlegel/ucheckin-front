import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useEffect } from 'react';

export const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY($where: EventWhereInput) {
    count: eventsCount(where: $where)
  }
`;

export const ALL_EVENTS_QUERY = gql`
  query ALL_EVENTS_QUERY($skip: Int = 0, $take: Int, $where: EventWhereInput) {
    events(take: $take, skip: $skip, where: $where, orderBy: { validityStart: desc }) {
      id
      name
      description
      validityStart
      validityEnd
      publishStart
      publishEnd
      privateEvent
      owner {
        id
        name
      }
      imageHome {
        publicUrlTransformed(transformation: { width: "200", height: "200" })
      }
    }
  }
`;

export const EVENT_QUERY = gql`
  query EVENT_QUERY($id: ID!) {
    event(where: { id: $id }) {
      id
      name
      owner {
        id
        name
      }
      imageHome {
        publicUrlTransformed(transformation: { width: "200", height: "200" })
      }
      description
      validityStart
      validityEnd
      publishStart
      publishEnd
      location
      lat
      lng
      privateEvent
      privateEventPassword
      application {
        id
        name
      }
      imageEvent {
        publicUrlTransformed(transformation: { width: "800", height: "600" })
      }
      eventDescription {
        document
      }
      notifications {
        id
        name
      }
    }
  }
`;

export const DELETE_EVENT_MUTATION = gql`
  mutation DELETE_EVENT_MUTATION($id: ID!) {
    deleteEvent(where: { id: $id }) {
      id
      name
    }
  }
`;

export const UPDATE_EVENT_MUTATION = gql`
  mutation UPDATE_EVENT_MUTATION($id: ID!, $data: EventUpdateInput!) {
    updateEvent(where: { id: $id }, data: $data) {
      id
    }
  }
`;

export const CREATE_EVENT_MUTATION = gql`
  mutation CREATE_EVENT_MUTATION($name: String!) {
    createEvent(data: { name: $name }) {
      id
    }
  }
`;

export function useFindEvent(eventId) {
  const [findEvent, { data, error, loading }] = useLazyQuery(EVENT_QUERY);
  useEffect(() => {
    if (eventId)
      findEvent({
        variables: { id: eventId },
      });
  }, [eventId, findEvent]);
  return {
    event: data?.event || {
      id: eventId,
    },
    eventError: error,
    eventLoading: loading,
  };
}
