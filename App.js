/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import OnboardingStack from 'navigators/onboarding-stack.navigator';
import ResetPasswordStack from 'navigators/reset-password-stack.navigator';
import HomeTabs from 'navigators/home-tabs.navigator';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as AuthActionCreators } from 'modules/ducks/auth/auth.actions';
import { Creators as PasswordActionCreators } from 'modules/ducks/password/password.actions';
import { selectIsLoggedIn } from 'modules/ducks/auth/auth.selectors';
import { selectUpdateParams as selectPasswordUpdateParams } from 'modules/ducks/password/password.selectors';

import { Linking } from 'react-native';

const App = ({
  purgeStoreAction,
  signOutAction,
  isLoggedIn,
  updatePasswordStartAction,
  passwordUpdateParams
}) => {
  React.useEffect(() => {
    // signOutAction(); // manual signout for debugging
    // purgeStoreAction(); // manual state purge for debugging

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

  return (
    <NavigationContainer>
      <HomeTabs />
    </NavigationContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  isLoggedIn: selectIsLoggedIn,
  passwordUpdateParams: selectPasswordUpdateParams
});

const actions = {
  purgeStoreAction: AuthActionCreators.purgeStore, // for development and debugging
  signOutAction: AuthActionCreators.signOut,
  updatePasswordStartAction: PasswordActionCreators.updateStart
};

export default connect(mapStateToProps, actions)(App);
