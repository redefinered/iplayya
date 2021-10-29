/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import React from 'react';
import { StyleSheet } from 'react-native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionSpecs
} from '@react-navigation/stack';
import HeaderBackImage from 'components/header-back-image/header-back-image.component';
import SignInScreen from 'screens/sign-in/sign-in.screen';
import SignUpScreen from 'screens/sign-up/sign-up.screen';
import ForgotPasswordScreen from 'screens/forgot-password/forgot-password.screen';
import EmailSuccessScreen from 'screens/email-success/email-success.screen';
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
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec
        },
        cardStyleInterpolator: CardStyleInterpolators.FadeFromBottomAndroid,
        headerTransparent: true,
        headerTintColor: 'white',
        headerBackTitleVisible: false,
        headerBackImage: () => <HeaderBackImage />,
        headerStyle: { height: headerHeight },
        headerTitleStyle: { fontSize: 24 },
        headerTitleAlign: 'center',
        headerTitleContainerStyle: { alignItems: 'center' },
        headerLeftContainerStyle: {
          paddingLeft: 15,
          justifyContent: 'center',
          alignItems: 'center'
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
        name="EmailSuccessScreen"
        component={EmailSuccessScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
