import * as React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';
import App from './App';
import { name as appName } from './app.json';

import ReduxContainer from './redux.container';

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal'
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal'
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal'
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal'
    }
  }
};

const theme = {
  ...DefaultTheme,
  // dark: true,
  fonts: configureFonts(fontConfig),
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: '#E34398',
    accent: 'yellow',
    text: 'white'
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
