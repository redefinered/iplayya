/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import React from 'react';
import withHeaderPush from 'components/with-header-push/with-header-push.component';

import HomeIcon from 'images/tab-icons/home.svg';
import HomeIconActive from 'images/tab-icons/home_active.svg';
import AccountIcon from 'images/tab-icons/account.svg';
import AccountIconActive from 'images/tab-icons/account_active.svg';
import IptvIcon from 'images/tab-icons/iptv.svg';
import IptvIconActive from 'images/tab-icons/iptv_active.svg';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import IptvStack from 'navigators/iptv-stack.navigator';
import HomeStack from 'navigators/home-stack.navigator';
import AccountStack from 'navigators/account-stack.navigator';

const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator
    initialRouteName="Home"
    tabBarOptions={{
      showLabel: false,
      tabStyle: {
        backgroundColor: 'red',
        marginHorizontal: 50
      },
      style: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        position: 'absolute',
        left: 50,
        right: 50,
        bottom: 50
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

export default HomeTabs;
