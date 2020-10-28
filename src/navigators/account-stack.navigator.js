/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HeaderBackImage from 'components/header-back-image/header-back-image.component';
import AccountScreen from 'screens/account/account.screen';
import ProfileScreen from 'screens/profile/profile.screen';
import EditProfileScreen from 'screens/edit-profile/edit-profile.screen';
import Icon from 'components/icon/icon.component';

import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/nav/nav.actions';

import { headerHeight } from 'common/values';

const Stack = createStackNavigator();

const AccountStack = ({ setBottomTabsVisibleAction }) => (
  <Stack.Navigator
    screenOptions={{
      headerTransparent: true,
      headerTintColor: 'white',
      headerBackTitleVisible: false,
      headerBackImage: () => <HeaderBackImage />,
      headerStyle: { height: headerHeight },
      headerTitleStyle: { fontSize: 24 },
      headerTitleContainerStyle: { paddingTop: 30 },
      headerLeftContainerStyle: {
        paddingLeft: 15,
        justifyContent: 'flex-end'
      },
      headerRightContainerStyle: styles.headerRightContainerStyle
    }}
  >
    <Stack.Screen name="AccountScreen" component={AccountScreen} options={{ title: 'Account' }} />
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={({ navigation }) => ({
        title: null,
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <Pressable
              onPress={() => navigation.navigate('EditProfileScreen')}
              style={styles.headerButtonContainer}
            >
              <Icon name="edit" size={24} />
            </Pressable>
          </View>
        )
      })}
      listeners={{
        focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
        beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
      }}
    />
    <Stack.Screen
      name="EditProfileScreen"
      component={EditProfileScreen}
      options={{ title: 'Edit Profile' }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  headerRightContainerStyle: {
    paddingRight: 15,
    justifyContent: 'flex-end'
  },
  headerButtonContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15
  }
});

const actions = {
  setBottomTabsVisibleAction: Creators.setBottomTabsVisible
};

export default connect(null, actions)(AccountStack);
