import * as React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import App from './App';
import { name as appName } from './app.json';

import ReduxContainer from './redux.container';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    accent: 'yellow'
  }
};

export default function Main() {
  return (
    <ReduxContainer>
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    </ReduxContainer>
  );
}

AppRegistry.registerComponent(appName, () => Main);
