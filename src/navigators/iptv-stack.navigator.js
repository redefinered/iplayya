/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import HeaderBackImage from 'components/header-back-image/header-back-image.component';
import Icon from 'components/icon/icon.component.js';

import IptvScreen from 'screens/iptv/iptv.screen';
import AddIptvScreen from 'screens/iptv/add-iptv.screen';

import { headerHeight } from 'common/values';

import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/nav/nav.actions';

const Stack = createStackNavigator();

const IptvStack = ({ setBottomTabsVisibleAction }) => {
  const navigation = useNavigation();

  const onAddButtonPress = () => {
    navigation.navigate('AddIptvScreen');
    // setBottomTabsVisibleAction({ hideTabs: true });
  };

  return (
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
      <Stack.Screen
        name="IPTV"
        component={IptvScreen}
        options={{
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.headerButtonContainer}>
                <Icon name="search" size={24} />
              </View>
              <Pressable onPress={() => onAddButtonPress()} style={styles.headerButtonContainer}>
                <Icon name="add" size={24} />
              </Pressable>
            </View>
          )
        }}
      />
      <Stack.Screen
        name="AddIptvScreen"
        component={AddIptvScreen}
        options={{ title: 'Add IPTV' }}
        listeners={{
          focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
          beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
        }}
      />
    </Stack.Navigator>
  );
};

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

export default connect(null, actions)(IptvStack);
