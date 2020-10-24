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
import { selectCurrentUser } from 'modules/ducks/auth/auth.selectors';

const App = ({ currentUser, purgeStoreAction }) => {
  // React.useEffect(() => {
  //   purgeStoreAction();
  // }, []);

  if (!currentUser) return <SignInScreen />;

  return (
    <NavigationContainer>
      <HomeTabs />
    </NavigationContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

const actions = {
  purgeStoreAction: Creators.purgeStore,
  signOutAction: Creators.signOut
};

export default connect(mapStateToProps, actions)(App);
