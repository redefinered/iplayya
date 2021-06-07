/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingStack from 'navigators/onboarding-stack.navigator';
import ResetPasswordStack from 'navigators/reset-password-stack.navigator';
import HomeTabs from 'navigators/home-tabs.navigator';
import IptvStack from 'navigators/iptv-stack.navigator';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as AuthActionCreators } from 'modules/ducks/auth/auth.actions';
import { Creators as PasswordActionCreators } from 'modules/ducks/password/password.actions';
import { Creators as ProfileActionCreators } from 'modules/ducks/profile/profile.actions';
import { Creators as MoviesActionCreators } from 'modules/ducks/movies/movies.actions';
import { Creators as DownloadsActionCreators } from 'modules/ducks/downloads/downloads.actions';
import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';
import { selectIsLoggedIn } from 'modules/ducks/auth/auth.selectors';
import { selectUpdateParams as selectPasswordUpdateParams } from 'modules/ducks/password/password.selectors';
import { selectProviders } from 'modules/ducks/provider/provider.selectors';
import { selectSkippedProviderAdd } from 'modules/ducks/user/user.selectors';
import { Linking, Platform, StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { checkExistingDownloads, listDownloadedFiles, deleteFile } from 'services/download.service';
import Test from './test.component.js';

const App = ({
  purgeStoreAction,
  signOutAction,

  isLoggedIn,
  updatePasswordStartAction,
  passwordUpdateParams,
  providers,
  skippedProviderAdd,
  // getProfileAction,

  resetAction
}) => {
  const [testMode] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS === 'android') SplashScreen.hide();

    // signOutAction(); // manual signout for debugging
    // purgeStoreAction(); // manual state purge for debugging
    // resetAction();

    // checkExistingDownloads();
    // listDownloadedFiles();
    // deleteFile('19_12_Angry_Men.mp4');

    Linking.addEventListener('url', ({ url }) => {
      let regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;

      while ((match = regex.exec(url))) {
        params[match[1]] = match[2];
      }

      // set data required to reset password
      updatePasswordStartAction({ params });
    });
  }, []);

  // React.useEffect(() => {
  //   if (isLoggedIn) {
  //     getProfileAction();
  //   }
  // }, [isLoggedIn]);

  if (testMode) return <Test />;

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

  // if there is no provider show IPTV stack instead of home stack
  if (typeof providers !== 'undefined') {
    if (!providers.length && !skippedProviderAdd)
      return (
        <NavigationContainer>
          <IptvStack />
        </NavigationContainer>
      );
  }

  return (
    <NavigationContainer>
      <StatusBar translucent backgroundColor="transparent" />
      <HomeTabs />
    </NavigationContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  isLoggedIn: selectIsLoggedIn,
  passwordUpdateParams: selectPasswordUpdateParams,
  providers: selectProviders,
  skippedProviderAdd: selectSkippedProviderAdd
});

const actions = {
  purgeStoreAction: AuthActionCreators.purgeStore, // for development and debugging
  signOutAction: AuthActionCreators.signOut,
  updatePasswordStartAction: PasswordActionCreators.updateStart,
  // getProfileAction: ProfileActionCreators.get,
  // resetAction: DownloadsActionCreators.reset
  resetAction: MusicCreators.reset
};

export default connect(mapStateToProps, actions)(App);
