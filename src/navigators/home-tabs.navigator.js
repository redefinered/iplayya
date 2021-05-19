/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import React from 'react';

import HomeIcon from 'assets/tab-icons/home.svg';
import HomeIconActive from 'assets/tab-icons/home_active.svg';
import AccountIcon from 'assets/tab-icons/account.svg';
import AccountIconActive from 'assets/tab-icons/account_active.svg';
import IptvIcon from 'assets/tab-icons/iptv.svg';
import IptvIconActive from 'assets/tab-icons/iptv_active.svg';

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import IptvStack from 'navigators/iptv-stack.navigator';
import HomeStack from 'navigators/home-stack.navigator';
import AccountStack from 'navigators/account-stack.navigator';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectHideTabs } from 'modules/ducks/nav/nav.selectors';
import { Dimensions } from 'react-native';
import { selectSwipeEnabled } from 'modules/ducks/nav/nav.selectors';

// const Tab = createBottomTabNavigator();
const Tab = createMaterialTopTabNavigator();

const HomeTabs = ({ hideTabs, swipeEnabled }) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="none"
      tabBarPosition="bottom"
      swipeEnabled={swipeEnabled}
      initialLayout={{ width: Dimensions.get('window').width }}
      tabBarOptions={{
        showIcon: true,
        showLabel: false,
        pressColor: 'transparent',
        indicatorStyle: {
          height: 0
        },
        iconStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          padding: 30
        },
        tabStyle: {
          backgroundColor: 'transparent',
          // marginHorizontal: 50,
          flex: 1
          // width: '50%'
        },
        style: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: hideTabs ? -200 : 50,
          elevation: 0
        }
      }}
    >
      <Tab.Screen
        name="IPTV"
        component={IptvStack}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? <IptvIconActive /> : <IptvIcon />;
          }
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? <HomeIconActive /> : <HomeIcon />;
          }
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStack}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? <AccountIconActive /> : <AccountIcon />;
          }
        }}
      />
    </Tab.Navigator>
  );
};

const mapStateToProps = createStructuredSelector({
  hideTabs: selectHideTabs,
  swipeEnabled: selectSwipeEnabled
});

export default connect(mapStateToProps)(HomeTabs);
