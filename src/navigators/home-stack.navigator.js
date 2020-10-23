/* eslint-disable react/display-name */

import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HeaderBackImage from 'components/header-back-image/header-back-image.component';
import { headerHeight } from 'common/values';

import HomeScreen from 'screens/home/home.screen';
import SignUpScreen from 'screens/sign-up/sign-up.screen';
import ForgotPasswordScreen from 'screens/forgot-password/forgot-password.screen';
import ResetPasswordScreen from 'screens/reset-password/reset-password.screen';

const Stack = createStackNavigator();

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

const styles = StyleSheet.create({
  headerRightContainerStyle: {
    paddingRight: 15,
    justifyContent: 'flex-end'
  }
});

export default HomeStack;
