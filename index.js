import 'react-native-gesture-handler';

import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import App from './App';
import { name as appName } from './app.json';

import ReduxContainer from './redux.container';

// CUSTOMIZABLE ITEMS

// const DefaultTheme: Theme = {
//   dark: false,
//   roundness: 4,
//   colors: {
//     primary: '#6200ee',
//     accent: '#03dac4',
//     background: '#f6f6f6',
//     surface: white,
//     error: '#B00020',
//     text: black,
//     onBackground: '#000000',
//     onSurface: '#000000',
//     disabled: color(black).alpha(0.26).rgb().string(),
//     placeholder: color(black).alpha(0.54).rgb().string(),
//     backdrop: color(black).alpha(0.5).rgb().string(),
//     notification: pinkA400,
//   },
//   fonts: configureFonts(),
//   animation: {
//     scale: 1.0,
//   },
// };

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    accent: 'yellow'
  }
};

const Main = () => {
  return (
    <ReduxContainer>
      <PaperProvider theme={theme}>
        <App />
      </PaperProvider>
    </ReduxContainer>
  );
};

export default Main;

AppRegistry.registerComponent(appName, () => Main);
