/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HeaderBackImage from 'components/header-back-image/header-back-image.component';
import Icon from 'components/icon/icon.component.js';

import HomeScreen from 'screens/home/home.screen';
import ImovieScreen from 'screens/imovie/imovie.screen';

import { connect } from 'react-redux';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';

import { headerHeight } from 'common/values';

const Stack = createStackNavigator();

const HomeStack = ({ setBottomTabsVisibleAction }) => (
  <Stack.Navigator
    initialRouteName="Home"
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
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        title: 'iPlayya'
      }}
    />
    <Stack.Screen
      name="ImovieScreen"
      component={ImovieScreen}
      // eslint-disable-next-line no-unused-vars
      options={({ navigation }) => ({
        title: 'iMovie',
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <Pressable style={styles.headerButtonContainer}>
              <Icon name="search" size={24} />
            </Pressable>
          </View>
        )
      })}
      listeners={{
        focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
        beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
      }}
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
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible
};

export default connect(null, actions)(HomeStack);
