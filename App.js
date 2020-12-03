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
import { Creators as ProfileCreators } from 'modules/ducks/profile/profile.actions';
import { selectIsLoggedIn } from 'modules/ducks/auth/auth.selectors';
import { selectUpdateParams as selectPasswordUpdateParams } from 'modules/ducks/password/password.selectors';
import { selectProviders } from 'modules/ducks/provider/provider.selectors';
import { selectSkippedProviderAdd } from 'modules/ducks/user/user.selectors';

import { Linking } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

const App = ({
  purgeStoreAction,
  signOutAction,
  isLoggedIn,
  updatePasswordStartAction,
  passwordUpdateParams,
  providers,
  skippedProviderAdd,
  getProfileAction
}) => {
  const getToken = async () => {
    const token = await AsyncStorage.getItem('access_token');
  };

  React.useEffect(() => {
    // signOutAction(); // manual signout for debugging
    // purgeStoreAction(); // manual state purge for debugging

    getToken();

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

  React.useEffect(() => {
    if (isLoggedIn) {
      getProfileAction();
    }
  }, [isLoggedIn]);

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
  getProfileAction: ProfileCreators.get
};

export default connect(mapStateToProps, actions)(App);
