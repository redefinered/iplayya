/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from 'screens/home/home.screen';
import OnBoardingScreen from 'screens/onboarding/onboarding.screen';

import { View } from 'react-native';
import { Colors, IconButton } from 'react-native-paper';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/auth/auth.actions';
import { selectCurrentUser } from 'modules/ducks/auth/auth.selectors';

const Stack = createStackNavigator();

const HeaderActions = ({ signOutAction }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <IconButton
        icon="account-circle-outline"
        color={Colors.blue500}
        size={30}
        onPress={() => console.log('Pressed')}
      />
      <IconButton
        icon="logout-variant"
        color={Colors.red500}
        size={30}
        onPress={() => signOutAction()}
      />
    </View>
  );
};

const App = ({ currentUser, signOutAction, purgeStoreAction }) => {
  // React.useEffect(() => {
  //   purgeStoreAction();
  // }, []);

  const handleSignOut = () => {
    purgeStoreAction();
    signOutAction();
  };

  if (!currentUser) return <OnBoardingScreen />;
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerRight: () => <HeaderActions signOutAction={handleSignOut} />,
            title: 'Welcome'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = createStructuredSelector({ currentUser: selectCurrentUser });

const actions = {
  purgeStoreAction: Creators.purgeStore,
  signOutAction: Creators.signOut
};

export default connect(mapStateToProps, actions)(App);
