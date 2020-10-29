/* eslint-disable react/display-name */
import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HeaderBackImage from 'components/header-back-image/header-back-image.component';
import SignInScreen from 'screens/sign-in/sign-in.screen';
import SignUpScreen from 'screens/sign-up/sign-up.screen';
import ForgotPasswordScreen from 'screens/forgot-password/forgot-password.screen';
import ResetPasswordScreen from 'screens/reset-password/reset-password.screen';
import { headerHeight } from 'common/values';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  headerRightContainerStyle: {
    paddingRight: 15,
    justifyContent: 'flex-end'
  }
});

const OnboardingStack = () => {
  return (
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
      <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
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
};

export default OnboardingStack;