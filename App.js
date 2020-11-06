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
import { Creators } from 'modules/ducks/auth/auth.actions';
import { Creators as NavCreators } from 'modules/ducks/nav/nav.actions';
import {
  selectIsLoggedIn,
  selectResetPasswordParams,
  selectPasswordUpdated
} from 'modules/ducks/auth/auth.selectors';

import { Linking } from 'react-native';

// eslint-disable-next-line no-unused-vars
const App = ({
  isLoggedIn,
  setBottomTabsVisibleAction,
  resetPasswordStartAction,
  resetPasswordParams,
  passwordUpdated,
  signOutAction,
  purgeStoreAction
}) => {
  const [redirectToResetPassword, setRedirectToResetPassword] = React.useState(false);
  React.useEffect(() => {
    // signOutAction(); // manual signout for debugging
    // purgeStoreAction(); // manual state purge for debugging

    // makes sure main tab navigation is always visible on application mount
    setBottomTabsVisibleAction(true);

    Linking.addEventListener('url', ({ url }) => {
      let regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;

      while ((match = regex.exec(url))) {
        params[match[1]] = match[2];
      }

      // set data required to reset password
      resetPasswordStartAction({ params });

      // redirects app to reset-password screen
      setRedirectToResetPassword(true);
    });
  }, []);

  if (!passwordUpdated)
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
  resetPasswordParams: selectResetPasswordParams,
  passwordUpdated: selectPasswordUpdated
});

const actions = {
  purgeStoreAction: Creators.purgeStore, // for development and debugging
  signOutAction: Creators.signOut,
  setBottomTabsVisibleAction: NavCreators.setBottomTabsVisible,
  resetPasswordStartAction: Creators.resetPasswordStart
};

export default connect(mapStateToProps, actions)(App);
