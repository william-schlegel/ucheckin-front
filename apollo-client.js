import { ApolloClient, InMemoryCache } from '@apollo/client';
import { endpoint, prodEndpoint } from './config';

const client = new ApolloClient({
  uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
  cache: new InMemoryCache(),
});

export default client;
