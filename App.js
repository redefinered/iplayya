/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import 'react-native-gesture-handler';

import React from 'react';
import { View, Linking, Platform, StatusBar, StyleSheet } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingStack from 'navigators/onboarding-stack.navigator';
import ResetPasswordStack from 'navigators/reset-password-stack.navigator';
import HomeTabs from 'navigators/home-tabs.navigator';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectIsLoading } from 'modules/app';
import { Creators as ProfileCreators } from 'modules/ducks/profile/profile.actions';
import { Creators as UserCreators } from 'modules/ducks/user/user.actions';
import { Creators as PasswordActionCreators } from 'modules/ducks/password/password.actions';
import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';
import { Creators as NotifCreators } from 'modules/ducks/notifications/notifications.actions';
import { selectIsLoggedIn } from 'modules/ducks/auth/auth.selectors';
import { selectUpdateParams as selectPasswordUpdateParams } from 'modules/ducks/password/password.selectors';
import SplashScreen from 'react-native-splash-screen';
import Test from './test.component.js';
import { selectCurrentUser } from 'modules/ducks/auth/auth.selectors.js';
import { selectUpdated } from 'modules/ducks/profile/profile.selectors.js';

import NotifService from 'NotifService';
// import { selectNotifications } from 'modules/ducks/itv/itv.selectors.js';

// eslint-disable-next-line no-unused-vars
import { resetStore } from 'modules/store';

import { Button } from 'react-native-paper';

// eslint-disable-next-line no-unused-vars
const HomeComponent = () => (
  <NavigationContainer>
    <StatusBar translucent backgroundColor="transparent" />
    <HomeTabs />
  </NavigationContainer>
);

const App = ({
  isLoading,
  isLoggedIn,
  updatePasswordStartAction,
  passwordUpdateParams,
  resetNowPlayingAction,
  currentUser,
  setProviderAction,
  getProfileAction,
  profileUpdated,
  onRegisterAction,
  onNotifAction
}) => {
  const theme = useTheme();
  const [testMode] = React.useState(false);
  const [notif, setNotif] = React.useState(null);

  React.useEffect(() => {
    if (testMode) {
      const notif = new NotifService(onRegisterAction, onNotifAction);

      setNotif(notif);
    }
  }, [testMode]);

  React.useEffect(() => {
    if (Platform.OS === 'android') SplashScreen.hide();

    // resetStore();

    resetNowPlayingAction();

    Linking.addEventListener('url', ({ url }) => {
      /// decode uri from deep link
      const urldecoded = decodeURIComponent(url);

      /// extract the query parameter called "params"
      let regex = /[?&]([^=#]+)=([^&#]*)/g,
        urlparams = {},
        match;

      while ((match = regex.exec(urldecoded))) {
        urlparams[match[1]] = match[2];
      }

      const { params } = urlparams;

      /// get token and email form extracted parameter
      const splitparams = params.split(',');

      const [token, email] = splitparams.map((i) => {
        return i.split('|')[1];
      });

      /// set data required to reset password
      // this will redirect the app to reset-password screen
      updatePasswordStartAction({ params: { token, email } });
    });
  }, []);

  // if profile is updated get profile to update profile data
  React.useEffect(() => {
    if (profileUpdated) {
      getProfileAction();
    }
  }, [profileUpdated]);

  React.useEffect(() => {
    if (isLoggedIn) {
      const { providers } = currentUser;
      if (providers.length) {
        setProviderAction(providers[0].id);
      }
    }
  }, [isLoggedIn, currentUser]);

  if (testMode)
    return (
      <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
        <Button onPress={() => notif.localNotif()}>Test notication</Button>
        <Button
          onPress={() =>
            notif.getScheduledLocalNotifications((notifications) => console.log({ notifications }))
          }
        >
          check notifs notication
        </Button>
        <Button onPress={() => notif.cancelAll()}>cancel all notications</Button>
      </View>
    );

  if (isLoading && isLoggedIn)
    return (
      <View
        style={{
          justifyContent: 'center',
          backgroundColor: theme.iplayya.colors.goodnight,
          ...StyleSheet.absoluteFillObject
        }}
      >
        <StatusBar barStyle="light-content" />
        <ActivityIndicator />
      </View>
    );

  // if (testMode) return <Test />;

  if (passwordUpdateParams)
    return (
      <NavigationContainer>
        <ResetPasswordStack />
      </NavigationContainer>
    );

  if (!isLoggedIn)
    return (
      <NavigationContainer>
        <OnboardingStack />
      </NavigationContainer>
    );

  return <HomeComponent />;
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  isLoading: selectIsLoading,
  isLoggedIn: selectIsLoggedIn,
  passwordUpdateParams: selectPasswordUpdateParams,
  profileUpdated: selectUpdated
  // notifications: selectNotifications
});

const actions = {
  updatePasswordStartAction: PasswordActionCreators.updateStart,
  resetNowPlayingAction: MusicCreators.resetNowPlaying,
  setProviderAction: UserCreators.setProvider,
  getProfileAction: ProfileCreators.get,
  onRegisterAction: NotifCreators.onRegister,
  onNotifAction: NotifCreators.onNotif
};

export default connect(mapStateToProps, actions)(App);
