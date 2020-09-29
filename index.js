import 'react-native-gesture-handler';

import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import App from './App';
import { name as appName } from './app.json';

import ReduxContainer from './redux.container';

const Main = () => {
  return (
    <ReduxContainer>
      <PaperProvider>
        <App />
      </PaperProvider>
    </ReduxContainer>
  );
};

export default Main;

AppRegistry.registerComponent(appName, () => Main);
