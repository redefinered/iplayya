/* eslint-disable react/prop-types */

import 'react-native-gesture-handler';

import React from 'react';
import { View, Linking, Platform, StatusBar, StyleSheet } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingStack from 'navigators/onboarding-stack.navigator';
import ResetPasswordStack from 'navigators/reset-password-stack.navigator';
import HomeTabs from 'navigators/home-tabs.navigator';
import IptvStack from 'navigators/iptv-stack.navigator';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators, selectIsLoading } from 'modules/app';
import { Creators as ProfileCreators } from 'modules/ducks/profile/profile.actions';
import { Creators as UserCreators } from 'modules/ducks/user/user.actions';
import { Creators as AuthActionCreators } from 'modules/ducks/auth/auth.actions';
import { Creators as PasswordActionCreators } from 'modules/ducks/password/password.actions';
import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';
import { selectIsLoggedIn } from 'modules/ducks/auth/auth.selectors';
import { selectUpdateParams as selectPasswordUpdateParams } from 'modules/ducks/password/password.selectors';
// import { selectProviders } from 'modules/ducks/provider/provider.selectors';
// import { selectSkippedProviderAdd } from 'modules/ducks/user/user.selectors';
import SplashScreen from 'react-native-splash-screen';
// import { checkExistingDownloads, listDownloadedFiles, deleteFile } from 'services/download.service';
import Test from './test.component.js';
// import { resetStore } from 'modules/store';
import { selectCurrentUser } from 'modules/ducks/auth/auth.selectors.js';
import { selectUpdated } from 'modules/ducks/profile/profile.selectors.js';
import { selectIsProviderSetupSkipped } from 'modules/ducks/provider/provider.selectors.js';

const HomeComponent = () => (
  <NavigationContainer>
    <StatusBar translucent backgroundColor="transparent" />
    <HomeTabs />
  </NavigationContainer>
);

const App = ({
  isLoading,

  // purgeStoreAction,
  // signOutAction,

  isLoggedIn,
  updatePasswordStartAction,
  passwordUpdateParams,
  // passwordUpdated,
  // passwordResetStart,
  // providers,
  // skippedProviderAdd,

  resetNowPlayingAction,

  currentUser,
  setProviderAction,

  getProfileAction,
  profileUpdated,
  // onboardinginfo,

  isProviderSetupSkipped
}) => {
  const theme = useTheme();
  const [testMode] = React.useState(false);

  React.useEffect(() => {
    if (Platform.OS === 'android') SplashScreen.hide();

    // signOutAction(); // manual signout for debugging
    // purgeStoreAction(); // manual state purge for debugging

    // checkExistingDownloads();
    // listDownloadedFiles();
    // deleteFile('19_12_Angry_Men.mp4');

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

  // React.useEffect(() => {
  //   // might not be necessary
  //   if (typeof onboardinginfo === 'undefined') return;

  //   const { skippedProviderSetup } = onboardinginfo;

  //   if (typeof skippedProviderSetup === 'undefined') return;

  //   if (skippedProviderSetup) {
  //     return setSkippedProviderAdd(true);
  //   } else {
  //     return setSkippedProviderAdd(false);
  //   }

  //   // setSkippedProviderAdd(false);
  // });

  React.useEffect(() => {
    if (isLoggedIn) {
      const { providers } = currentUser;
      if (providers.length) {
        setProviderAction(providers[0].id);
      }
      // console.log('fua;dskljfas  ;alkdfj;alsdjf');
    }
  }, [isLoggedIn, currentUser]);

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

  /// if provider add is not skipped
  if (!isProviderSetupSkipped)
    return (
      <NavigationContainer>
        <IptvStack />
      </NavigationContainer>
    );

  return <HomeComponent />;
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  isLoading: selectIsLoading,
  isLoggedIn: selectIsLoggedIn,
  passwordUpdateParams: selectPasswordUpdateParams,
  // passwordUpdated: selectPasswordUpdated,
  // providers: selectProviders,
  // skippedProviderAdd: selectSkippedProviderAdd,
  profileUpdated: selectUpdated,
  // onboardinginfo: selectOnboardinginfo,
  isProviderSetupSkipped: selectIsProviderSetupSkipped
});

const actions = {
  purgeStoreAction: Creators.purgeStore, // for development and debugging
  signOutAction: AuthActionCreators.signOut,
  updatePasswordStartAction: PasswordActionCreators.updateStart,
  resetNowPlayingAction: MusicCreators.resetNowPlaying,
  setProviderAction: UserCreators.setProvider,
  getProfileAction: ProfileCreators.get
};

export default connect(mapStateToProps, actions)(App);
