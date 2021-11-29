/* eslint-disable react/prop-types */

import 'react-native-gesture-handler';

import React from 'react';
import { View, Linking, Platform, StatusBar, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingStack from 'navigators/onboarding-stack.navigator';
import ResetPasswordStack from 'navigators/reset-password-stack.navigator';
import IptvStack from 'navigators/iptv-stack.navigator';
import HomeTabs from 'navigators/home-tabs.navigator';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  Creators as AppCreators,
  selectIsLoading,
  selectMovieCategories,
  selectMusicGenres
} from 'modules/app';
// import { Creators as ProfileCreators } from 'modules/ducks/profile/profile.actions';
import { Creators as PasswordActionCreators } from 'modules/ducks/password/password.actions';
import { Creators as ImusicCreators } from 'modules/ducks/music/music.actions';
import { Creators as ImovieCreators } from 'modules/ducks/movies/movies.actions';
import { Creators as NotifCreators } from 'modules/ducks/notifications/notifications.actions';
import { selectIsLoggedIn } from 'modules/ducks/auth/auth.selectors';
import { selectUpdateParams as selectPasswordUpdateParams } from 'modules/ducks/password/password.selectors';
import SplashScreen from 'react-native-splash-screen';
import { selectCurrentUser } from 'modules/ducks/auth/auth.selectors.js';
import { selectUpdated, selectProfile } from 'modules/ducks/profile/profile.selectors.js';
import NotifService from 'NotifService';
import { Button } from 'react-native-paper';
import { selectError } from 'modules/ducks/user/user.selectors.js';
import theme from 'common/theme';

// eslint-disable-next-line no-unused-vars
import { resetStore } from 'modules/store';
import Test from './test.component.js';

// eslint-disable-next-line no-unused-vars
const HomeComponent = () => (
  <NavigationContainer>
    <StatusBar translucent backgroundColor="transparent" />
    <HomeTabs />
  </NavigationContainer>
);

const App = ({
  userError,
  isLoading,
  isLoggedIn,
  passwordUpdateParams,
  profile,
  // profileUpdated,
  movieCategories,
  musicGenres,
  onNotifAction,
  onRegisterAction,
  // getProfileAction,
  setProviderAction,
  resetNowPlayingAction,
  updatePasswordStartAction,
  setImoviePaginatorInfoAction,
  setImusicPaginatorInfoAction
}) => {
  const [providerError, setProviderError] = React.useState(false);
  const [testMode, setTestMode] = React.useState(false);
  const [notif, setNotif] = React.useState(null);

  React.useEffect(() => {
    /// set the paginator information for imovie screen
    if (movieCategories.length) setImoviePaginatorInfoAction(movieCategories);
  }, [movieCategories]);

  React.useEffect(() => {
    /// set the paginator information for imovie screen
    if (musicGenres.length) setImusicPaginatorInfoAction(musicGenres);
  }, [musicGenres]);

  React.useEffect(() => {
    if (userError === 'Error: Provider not match') return setProviderError(true);

    /// fallback to false for anything other than above
    setProviderError(false);
  }, [userError]);

  React.useEffect(() => {
    if (testMode) {
      const notif = new NotifService(onRegisterAction, onNotifAction);

      setNotif(notif);
    }
  }, [testMode]);

  React.useEffect(() => {
    if (Platform.OS === 'android') SplashScreen.hide();

    // resetStore(); /// for development

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

      /// get profile when updated
      // if (profileUpdated) {
      //   getProfileAction();
      // }
    });
  }, []);

  React.useEffect(() => {
    if (!isLoggedIn) return;
    if (!profile) return;

    const { providers } = profile;

    if (!providers.length) return;

    const provider = providers.find(({ is_active }) => is_active === true);
    setProviderAction(provider.id);
  }, [isLoggedIn]);

  // React.useEffect(() => {
  //   if (!dataLoaded) return;

  //   setIsReady(true);
  // }, [dataLoaded]);

  // if profile is updated get profile to update profile data
  // React.useEffect(() => {
  //   if (profileUpdated) {
  //     getProfileAction();
  //   }
  // }, [profileUpdated]);

  // React.useEffect(() => {
  //   if (isLoggedIn) {
  //     const { providers } = currentUser;
  //     if (providers.length) {
  //       setProviderAction(providers[0].id);
  //     }
  //   }
  // }, [isLoggedIn, currentUser]);

  const handleTestNotif = () => {
    setTestMode(false);

    // create a dummy notification that will notify after 1 minute
    // ITV: TLC - 304
    // ISPORTS: |US| NBA League Pass 1 (live Events) - 3611
    notif.localNotif({
      id: 123,
      channelId: '3611',
      channelName: '|US| NBA League Pass 1 (live Events)',
      parentType: 'ISPORTS'
    });
  };

  if (testMode)
    return (
      <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
        <Button onPress={handleTestNotif}>Test notication</Button>
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

  if (providerError) {
    return (
      <NavigationContainer>
        <IptvStack />
      </NavigationContainer>
    );
  }

  return <HomeComponent />;
};

const mapStateToProps = createStructuredSelector({
  userError: selectError,
  currentUser: selectCurrentUser,
  isLoading: selectIsLoading,
  isLoggedIn: selectIsLoggedIn,
  passwordUpdateParams: selectPasswordUpdateParams,
  profile: selectProfile,
  profileUpdated: selectUpdated,
  movieCategories: selectMovieCategories,
  musicGenres: selectMusicGenres
});

const actions = {
  updatePasswordStartAction: PasswordActionCreators.updateStart,
  resetNowPlayingAction: ImusicCreators.resetNowPlaying,
  setProviderAction: AppCreators.setProvider,
  // getProfileAction: ProfileCreators.get,
  onRegisterAction: NotifCreators.onRegister,
  onNotifAction: NotifCreators.onNotif,
  setImoviePaginatorInfoAction: ImovieCreators.setPaginatorInfo,
  setImusicPaginatorInfoAction: ImusicCreators.setPaginatorInfo
};

export default connect(mapStateToProps, actions)(App);
