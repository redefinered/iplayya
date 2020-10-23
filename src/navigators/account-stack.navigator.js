/* eslint-disable react/display-name */

import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HeaderBackImage from 'components/header-back-image/header-back-image.component';
import AccountScreen from 'screens/account/account.screen';

import { headerHeight } from 'common/values';

const Stack = createStackNavigator();

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

const styles = StyleSheet.create({
  headerRightContainerStyle: {
    paddingRight: 15,
    justifyContent: 'flex-end'
  }
});

export default AccountStack;
