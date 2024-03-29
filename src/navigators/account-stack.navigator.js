/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HeaderBackImage from 'components/header-back-image/header-back-image.component';
import AccountScreen from 'screens/account/account.screen';
import ProfileScreen from 'screens/profile/profile.screen';
import EditProfileScreen from 'screens/edit-profile/edit-profile.screen';
import ChangePasswordScreen from 'screens/change-password/change-password.screen';
import PlaybackSettings from 'screens/playback-settings/playback-settings.screen';
import ManageEmailScreen from 'screens/manage-email/manage-email.screen';
import ChangeEmailScreen from 'screens/manage-email/change-email.screen';
import NeedHelpScreen from 'screens/need-help/need-help.screen';
import WalkthroughScreen from 'screens/walkthrough/walkthrough.screen';
import Icon from 'components/icon/icon.component';
import { TouchableRipple } from 'react-native-paper';

import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/nav/nav.actions';

import { headerHeight } from 'common/values';
import theme from 'common/theme';

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
      headerTitleAlign: 'center',
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
      options={{ title: 'Account', animationEnabled: false }}
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
                  <Icon name="edit" size={theme.iconSize(3)} />
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
      name="ChangePasswordScreen"
      component={ChangePasswordScreen}
      options={{ title: 'Change Password' }}
      listeners={{
        focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
        beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
      }}
    />
    <Stack.Screen
      name="ManageEmailScreen"
      component={ManageEmailScreen}
      options={{ title: 'Manage Email' }}
      listeners={{
        focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
        beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
      }}
    />
    <Stack.Screen
      name="ChangeEmailScreen"
      component={ChangeEmailScreen}
      options={{ title: 'Change Email' }}
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
    <Stack.Screen
      name="NeedHelpScreen"
      component={NeedHelpScreen}
      options={{ title: 'Need Help?' }}
      listeners={{
        focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
        beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
      }}
    />
    <Stack.Screen
      name="WalkthroughScreen"
      component={WalkthroughScreen}
      options={{ title: 'Walkthrough' }}
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
