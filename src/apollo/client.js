/* eslint-disable no-undef */

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-community/async-storage';

const httpLink = createHttpLink({
  uri: 'http://ns375513.ip-37-187-174.eu/graphql'
  // uri_old: 'https://iplayya.herokuapp.com/graphql'
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
  uri: 'https://iplayya.herokuapp.com/graphql',
  cache: new InMemoryCache()
});

export default client;
