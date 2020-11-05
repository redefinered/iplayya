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
import { selectIsLoggedIn } from 'modules/ducks/auth/auth.selectors';

import { Linking } from 'react-native';

// eslint-disable-next-line no-unused-vars
const App = ({ isLoggedIn, setBottomTabsVisibleAction, signOutAction, purgeStoreAction }) => {
  const [passwordResetParams, setPasswordResetParams] = React.useState(null);
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

      setPasswordResetParams(params);
    });
  }, []);

  if (passwordResetParams)
    return (
      <NavigationContainer>
        <ResetPasswordStack passwordResetParams={passwordResetParams} />
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
  isLoggedIn: selectIsLoggedIn
});

const actions = {
  purgeStoreAction: Creators.purgeStore, // for development and debugging
  signOutAction: Creators.signOut,
  setBottomTabsVisibleAction: NavCreators.setBottomTabsVisible
};

export default connect(mapStateToProps, actions)(App);
