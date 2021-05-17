/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HeaderBackImage from 'components/header-back-image/header-back-image.component';
import AccountScreen from 'screens/account/account.screen';
import ProfileScreen from 'screens/profile/profile.screen';
import EditProfileScreen from 'screens/edit-profile/edit-profile.screen';
import PlaybackSettings from 'screens/playback-settings/playback-settings.screen';
import Icon from 'components/icon/icon.component';
import { TouchableRipple } from 'react-native-paper';

import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/nav/nav.actions';

import { headerHeight } from 'common/values';

const Stack = createStackNavigator();

const AccountStack = ({ setBottomTabsVisibleAction, enableSwipeAction }) => (
  <Stack.Navigator
    screenOptions={{
      headerTransparent: true,
      headerTintColor: 'white',
      headerBackTitleVisible: false,
      headerBackImage: () => <HeaderBackImage />,
      headerStyle: { height: headerHeight },
      headerTitleStyle: { fontSize: 24 },
      headerTitleContainerStyle: { alignItems: 'center' },
      headerLeftContainerStyle: {
        paddingLeft: 15,
        justifyContent: 'center',
        alignItems: 'center'
      },
      headerRightContainerStyle: styles.headerRightContainerStyle
    }}
  >
    <Stack.Screen
      name="AccountScreen"
      component={AccountScreen}
      options={{ title: 'Account' }}
      listeners={{
        focus: () => enableSwipeAction({ swipeEnabled: true }),
        beforeRemove: () => enableSwipeAction({ swipeEnabled: false })
      }}
    />
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={({ navigation }) => ({
        title: null,
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <TouchableRipple
              borderless={true}
              style={{ borderRadius: 44, padding: 8 }}
              rippleColor="rgba(0,0,0,0.28)"
              onPress={() => navigation.navigate('EditProfileScreen')}
            >
              <View>
                <View style={styles.headerButtonContainer}>
                  <Icon name="edit" size={24} />
                </View>
              </View>
            </TouchableRipple>
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
    <Stack.Screen
      name="PlaybackSettings"
      component={PlaybackSettings}
      options={{ title: 'Playback' }}
      listeners={{
        focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
        beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
      }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  headerRightContainerStyle: {
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerButtonContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const actions = {
  setBottomTabsVisibleAction: Creators.setBottomTabsVisible,
  enableSwipeAction: Creators.enableSwipe
};

export default connect(null, actions)(AccountStack);
