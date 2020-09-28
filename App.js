import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Home from 'screens/home.screen';

const App = () => {
  return (
    <NavigationContainer>
      <Home />
    </NavigationContainer>
  );
};

export default App;
