import React from 'react';
import PropTypes from 'prop-types';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { connect } from 'react-redux';
import { createStructureSelector } from 'reselect';
import { selectCurrentUser } from 'modules/ducks/auth/auth.selectors';

import HomeScreen from 'screens/home/home.screen';
import OnBoardingScreen from 'screens/onboarding/onboarding.screen';

const Stack = createStackNavigator();

const App = ({ currentUser }) => {
  if (!currentUser) return <OnBoardingScreen />;
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: null }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

App.propTypes = {
  currentUser: PropTypes.object
};

const mapStateToProps = createStructureSelector({ currentUser: selectCurrentUser });

export default connect(mapStateToProps)(App);
