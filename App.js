/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import { View } from 'react-native';
// import { Colors, IconButton } from 'react-native-paper';
import HeaderBackImage from 'components/header-back-image/header-back-image.component';
// import Icon from 'components/icon/icon.component';

import HomeScreen from 'screens/home/home.screen';
import SignInScreen from 'screens/sign-in/sign-in.screen';
import SignUpScreen from 'screens/sign-up/sign-up.screen';
// import AddIptvScreen from 'screens/add-iptv/add-iptv.screen';
import ForgotPasswordScreen from 'screens/forgot-password/forgot-password.screen';
import ResetPasswordScreen from 'screens/reset-password/reset-password.screen';
import IptvScreen from 'screens/iptv/iptv.screen';
import AccountScreen from 'screens/account/account.screen';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/auth/auth.actions';
import { selectCurrentUser } from 'modules/ducks/auth/auth.selectors';

import { headerHeight } from 'common/values';

import TabBarIcon from 'components/tabbar-icon/tabbar-icon.component';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// const HeaderActions = ({ signOutAction }) => {
//   return (
//     <View style={{ flexDirection: 'row' }}>
// <IconButton
//   icon="account-circle-outline"
//   color={Colors.blue500}
//   size={30}
//   onPress={() => console.log('Pressed')}
// />
//       <IconButton
//         icon="logout-variant"
//         color={Colors.red500}
//         size={30}
//         onPress={() => signOutAction()}
//       />
//       <IconButton
//         style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
//         icon="camera"
//         color={Colors.white}
//         size={20}
//         onPress={() => console.log('Pressed')}
//       />
//     </View>
//   );
// };

const App = ({ currentUser }) => {
  // simulate logged-in state
  currentUser = { name: 'Red' };

  if (!currentUser) return <SignInScreen />;
  // return (
  //   <NavigationContainer>
  //     <Stack.Navigator
  //       initialRouteName="Home"
  //       screenOptions={{
  //         headerTransparent: true,
  //         headerTintColor: 'white',
  //         headerBackTitleVisible: false,
  //         headerBackImage: () => <HeaderBackImage />,
  //         headerStyle: { height: headerHeight },
  //         headerTitleStyle: { fontSize: 24 },
  //         headerTitleContainerStyle: { paddingTop: 30 },
  //         headerLeftContainerStyle: {
  //           paddingLeft: 15,
  //           justifyContent: 'flex-end'
  //         },
  //         headerRightContainerStyle: styles.headerRightContainerStyle
  //       }}
  //     >
  //       <Stack.Screen
  //         name="HomeScreen"
  //         component={HomeScreen}
  //         options={{
  //           // headerRight: () => <HeaderActions signOutAction={handleSignOut} />,
  //           title: 'iPlayya'
  //         }}
  //       />
  //       <Stack.Screen
  //         name="AddIptvScreen"
  //         component={AddIptvScreen}
  //         options={{ title: 'Add IPTV' }}
  //       />
  //       <Stack.Screen
  //         name="SignUpScreen"
  //         component={SignUpScreen}
  //         options={{
  //           title: 'Sign Up'
  //           // headerRight: () => (
  //           //   <View style={styles.headerButtonContainer}>
  //           //     <Icon name="video-settings" style={{ color: 'white' }} size={16} />
  //           //   </View>
  //           // ),
  //         }}
  //       />
  //       <Stack.Screen
  //         name="ForgotPasswordScreen"
  //         component={ForgotPasswordScreen}
  //         options={{ title: 'Forgot Password' }}
  //       />
  //       <Stack.Screen
  //         name="ResetPasswordScreen"
  //         component={ResetPasswordScreen}
  //         options={{ title: 'Reset Password' }}
  //       />
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );

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
          name="IptvScreen"
          component={IptvScreen}
          options={{ tabBarIcon: () => <TabBarIcon name="iptv" /> }}
          tabPress={() => console.log('test')}
        />
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused }) => {
              console.log({ focused });
              const name = focused ? 'iplayya' : 'account';
              // use different image states instead of icon. e.g. iplayya, iplayya-active
              return <TabBarIcon focused={focused} name={name} />;
            }
          }}
        />
        <Tab.Screen
          name="AccountScreen"
          component={AccountScreen}
          options={{ tabBarIcon: () => <TabBarIcon name="account" /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const HomeStack = () => {
  return (
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
          // headerRight: () => <HeaderActions signOutAction={handleSignOut} />,
          title: 'iPlayya'
        }}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{
          title: 'Sign Up'
          // headerRight: () => (
          //   <View style={styles.headerButtonContainer}>
          //     <Icon name="video-settings" style={{ color: 'white' }} size={16} />
          //   </View>
          // ),
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
