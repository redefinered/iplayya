/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import SignInScreen from 'screens/sign-in/sign-in.screen';
import HomeTabs from 'navigators/home-tabs.navigator';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/auth/auth.actions';
import { selectIsLoggedIn } from 'modules/ducks/auth/auth.selectors';

const App = ({ isLoggedIn, purgeStoreAction }) => {
  // React.useEffect(() => {
  //   purgeStoreAction();
  // }, []);

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
  purgeStoreAction: Creators.purgeStore,
  signOutAction: Creators.signOut
};

export default connect(mapStateToProps, actions)(App);
