/* eslint-disable react/prop-types */

import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import SignInScreen from 'screens/sign-in/sign-in.screen';
import HomeTabs from 'navigators/home-tabs.navigator';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/auth/auth.actions';
import { Creators as NavCreators } from 'modules/ducks/nav/nav.actions';
import { selectIsLoggedIn } from 'modules/ducks/auth/auth.selectors';

// eslint-disable-next-line no-unused-vars
const App = ({ isLoggedIn, setBottomTabsVisibleAction, signOutAction, purgeStoreAction }) => {
  React.useEffect(() => {
    // signOutAction(); // manual signout for debugging
    // purgeStoreAction(); // manual state purge for debugging

    // makes sure main tab navigation is always visible on application mount
    setBottomTabsVisibleAction(true);
  }, []);

  if (!isLoggedIn) return <SignInScreen />;

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
