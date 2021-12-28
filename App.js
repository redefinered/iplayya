/* eslint-disable react/prop-types */

import 'react-native-gesture-handler';

import React from 'react';
import { View, Linking, Platform, StatusBar, StyleSheet, Image } from 'react-native';
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
import MovieContextProvider from 'contexts/providers/movie/movie.provider';
import LinearGradient from 'react-native-linear-gradient';

// eslint-disable-next-line no-unused-vars
import { resetStore } from 'modules/store';
import Test from './test.component.js';
import { selectNotificationService } from 'modules/ducks/notifications/notifications.selectors.js';
import LottieView from 'lottie-react-native';

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
  movieCategories,
  musicGenres,

  /// notifications-specific actions
  onNotifAction,
  onRegisterAction,
  setNotificationServiceAction,

  notifService,

  setProviderAction,
  resetNowPlayingAction,
  updatePasswordStartAction,
  setImoviePaginatorInfoAction,
  setImusicPaginatorInfoAction
}) => {
  const notif = React.useRef(new NotifService(onRegisterAction, onNotifAction));

  const [providerError, setProviderError] = React.useState(false);
  const [testMode, setTestMode] = React.useState(false);
  const [isScreenLoad, setIsScreenLoad] = React.useState(true);

  React.useEffect(() => {
    if (!isLoading) return setIsScreenLoad(false);
  }, [isLoading]);

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

  // React.useEffect(() => {
  //   if (testMode) {
  //     const notif = new NotifService(onRegisterAction, onNotifAction);

  //     setNotif(notif);
  //   }
  // }, [testMode]);

  React.useEffect(() => {
    if (Platform.OS === 'android') SplashScreen.hide();

    setNotificationServiceAction(notif.current);

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

    notif.current.cancelAll();
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
    notifService.localNotif({
      id: 123,
      channelId: '3611',
      channelName: '|US| NBA League Pass 1 (live Events)',
      module: 'isports'
    });
  };

  if (testMode)
    return (
      <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
        <Button onPress={handleTestNotif}>Test notication</Button>
        {/* <Button
          onPress={() =>
            notif.getScheduledLocalNotifications((notifications) => console.log({ notifications }))
          }
        >
          check notifs notication
        </Button>
        <Button onPress={() => notif.cancelAll()}>cancel all notications</Button> */}
      </View>
    );

  const renderHomeLoader = () => {
    if (Platform.OS === 'ios')
      return <Image source={require('./animation.gif')} style={{ width: 200, height: 200 }} />;

    return (
      <LottieView
        source={require('./animation.json')}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
    );
  };

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

  if (isScreenLoad) {
    return (
      <LinearGradient
        colors={['#2D1449', '#0D0637']}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          ...StyleSheet.absoluteFillObject
        }}
      >
        <StatusBar barStyle="light-content" />
        {renderHomeLoader()}
      </LinearGradient>
    );
  }

  return (
    <MovieContextProvider>
      <HomeComponent />
    </MovieContextProvider>
  );
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
  musicGenres: selectMusicGenres,
  notifService: selectNotificationService
});

const actions = {
  updatePasswordStartAction: PasswordActionCreators.updateStart,
  resetNowPlayingAction: ImusicCreators.resetNowPlaying,
  setProviderAction: AppCreators.setProvider,
  setNotificationServiceAction: NotifCreators.setNotificationService,
  onRegisterAction: NotifCreators.onRegister,
  onNotifAction: NotifCreators.onNotif,
  setImoviePaginatorInfoAction: ImovieCreators.setPaginatorInfo,
  setImusicPaginatorInfoAction: ImusicCreators.setPaginatorInfo
};

export default connect(mapStateToProps, actions)(App);
