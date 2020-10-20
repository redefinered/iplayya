/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from 'screens/home/home.screen';
import SignInScreen from 'screens/sign-in/sign-in.screen';
import SignUpScreen from 'screens/sign-up/sign-up.screen';
import ForgotPasswordScreen from 'screens/forgot-password/forgot-password.screen';
import ResetPasswordScreen from 'screens/reset-password/reset-password.screen';
import IptvScreen from 'screens/iptv/iptv.screen';
import AccountScreen from 'screens/account/account.screen';

import HeaderBackImage from 'components/header-back-image/header-back-image.component';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/auth/auth.actions';
import { selectCurrentUser } from 'modules/ducks/auth/auth.selectors';

import { headerHeight } from 'common/values';

import HomeIcon from 'images/tab-icons/home.svg';
import HomeIconActive from 'images/tab-icons/home_active.svg';
import AccountIcon from 'images/tab-icons/account.svg';
import AccountIconActive from 'images/tab-icons/account_active.svg';
import IptvIcon from 'images/tab-icons/iptv.svg';
import IptvIconActive from 'images/tab-icons/iptv_active.svg';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = ({ currentUser }) => {
  // simulate logged-in state
  currentUser = { name: 'Red' };

  if (!currentUser) return <SignInScreen />;

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          showLabel: false,
          tabStyle: {
            backgroundColor: 'red',
            marginHorizontal: 50
          },
          style: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            position: 'absolute',
            left: 50,
            right: 50,
            bottom: 50
          }
        }}
      >
        <Tab.Screen
          name="IPTV"
          component={IptvStack}
          options={{
            tabBarIcon: ({ focused }) => {
              return focused ? <IptvIconActive /> : <IptvIcon />;
            }
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused }) => {
              return focused ? <HomeIconActive /> : <HomeIcon />;
            }
          }}
        />
        <Tab.Screen
          name="Account"
          component={AccountStack}
          options={{
            tabBarIcon: ({ focused }) => {
              return focused ? <AccountIconActive /> : <AccountIcon />;
            }
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const IptvStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerTransparent: true,
      headerTintColor: 'white',
      headerBackTitleVisible: false,
      headerBackImage: () => <HeaderBackImage />,
      headerStyle: { height: headerHeight },
      headerTitleStyle: { fontSize: 24 },
      headerTitleContainerStyle: { paddingTop: 30 },
      headerLeftContainerStyle: {
        paddingLeft: 15,
        justifyContent: 'flex-end'
      },
      headerRightContainerStyle: styles.headerRightContainerStyle
    }}
  >
    <Stack.Screen name="IPTV" component={IptvScreen} />
  </Stack.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerTransparent: true,
      headerTintColor: 'white',
      headerBackTitleVisible: false,
      headerBackImage: () => <HeaderBackImage />,
      headerStyle: { height: headerHeight },
      headerTitleStyle: { fontSize: 24 },
      headerTitleContainerStyle: { paddingTop: 30 },
      headerLeftContainerStyle: {
        paddingLeft: 15,
        justifyContent: 'flex-end'
      },
      headerRightContainerStyle: styles.headerRightContainerStyle
    }}
  >
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        title: 'iPlayya'
      }}
    />
    <Stack.Screen
      name="SignUpScreen"
      component={SignUpScreen}
      options={{
        title: 'Sign Up'
      }}
    />
    <Stack.Screen
      name="ForgotPasswordScreen"
      component={ForgotPasswordScreen}
      options={{ title: 'Forgot Password' }}
    />
    <Stack.Screen
      name="ResetPasswordScreen"
      component={ResetPasswordScreen}
      options={{ title: 'Reset Password' }}
    />
  </Stack.Navigator>
);

const AccountStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerTransparent: true,
      headerTintColor: 'white',
      headerBackTitleVisible: false,
      headerBackImage: () => <HeaderBackImage />,
      headerStyle: { height: headerHeight },
      headerTitleStyle: { fontSize: 24 },
      headerTitleContainerStyle: { paddingTop: 30 },
      headerLeftContainerStyle: {
        paddingLeft: 15,
        justifyContent: 'flex-end'
      },
      headerRightContainerStyle: styles.headerRightContainerStyle
    }}
  >
    <Stack.Screen name="Account" component={AccountScreen} />
  </Stack.Navigator>
);

const mapStateToProps = createStructuredSelector({ currentUser: selectCurrentUser });

const styles = {
  headerRightContainerStyle: {
    paddingRight: 15,
    justifyContent: 'flex-end'
  },
  headerButtonContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

const actions = {
  purgeStoreAction: Creators.purgeStore,
  signOutAction: Creators.signOut
};

export default connect(mapStateToProps, actions)(App);
