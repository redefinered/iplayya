/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { View } from 'react-native';
import { Colors, IconButton } from 'react-native-paper';

import HomeScreen from 'screens/home/home.screen';
import SignInScreen from 'screens/sign-in/sign-in.screen';
import SignUpScreen from 'screens/sign-up/sign-up.screen';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/auth/auth.actions';
import { selectCurrentUser } from 'modules/ducks/auth/auth.selectors';

// import { Text } from 'react-native';
import Icon from 'components/icon/icon.component';
// import BackImage from 'images/back.svg';

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
      <IconButton
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        icon="camera"
        color={Colors.white}
        size={20}
        onPress={() => console.log('Pressed')}
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

  // simulate logged-in state
  // currentUser = { name: 'Red' };

  if (!currentUser) return <SignInScreen />;
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUpScreen" screenOptions={{ headerTransparent: true }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            headerRight: () => <HeaderActions signOutAction={handleSignOut} />,
            title: 'Welcome',
            headerBackImage: () => <Icon name="video-settings" style={{ color: 'red' }} size={40} />
          }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{
            title: 'Sign-up',
            headerTintColor: 'white',
            headerBackImage: () => <Icon name="video-settings" style={{ color: 'white' }} size={40} />,
            // headerLeft: (props) => <HeaderBackButton backImage {...props} />,
            // headerStyle: { backgroundColor: 'transparent', position: 'absolute', borderWidth: 0 },
            headerRight: () => (
              <View style={{ marginRight: 15 }}>
                <Icon name="video-settings" style={{ color: 'white' }} size={40} />
              </View>
            ),
            headerRightContainerStyle: { backgroundColor: 'transparent' }
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
