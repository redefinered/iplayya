/* eslint-disable no-undef */

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-community/async-storage';

const GRAPHQL_ENDPOINT = 'https://94.130.20.221/graphql';

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await AsyncStorage.getItem('access_token');
  // return the headers to the context so httpLink can read them

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export const clientWithoutAuthLink = new ApolloClient({
  // uri: GRAPHQL_ENDPOINT,
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
