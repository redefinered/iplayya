import * as React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import App from './App';
import { name as appName } from './app.json';

import ReduxContainer from './redux.container';
import client from 'apollo/client';
import theme from 'common/theme';

import { ApolloProvider } from '@apollo/client';

const ApolloWrapped = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

export default function Main() {
  return (
    <ReduxContainer>
      <PaperProvider theme={theme}>
        <ApolloWrapped />
      </PaperProvider>
    </ReduxContainer>
  );
}

AppRegistry.registerComponent(appName, () => Main);
