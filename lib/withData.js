import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { onError } from '@apollo/link-error';
import { createUploadLink } from 'apollo-upload-client';
import withApollo from 'next-with-apollo';

import { endpoint, prodEndpoint } from '../config';

export function createClient({ headers }) {
  return new ApolloClient({
    // ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.error(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError)
          console.error(`[Network error]: ${networkError}. Backend is unreachable. Is it running?`);
      }),
      // this uses apollo-link-http under the hood, so all the options here come from that package
      createUploadLink({
        uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
        credentials: 'include',
        headers,
        // fetchOptions: {
        //   credentials: 'include',
        //   headers,
        // },
      }),
    ]),
    cache: new InMemoryCache(),
    // cache: new InMemoryCache({
    //   typePolicies: {
    //     NotificationItem: {
    //       fields: {
    //         image: {
    //           merge(existing, incoming) {
    //             return { ...existing, ...incoming };
    //           },
    //         },
    //       },
    //     },
    //   },
    // }),
    // .restore(initialState || {}),
  });
}

export default withApollo(createClient, { getDataFromTree });
