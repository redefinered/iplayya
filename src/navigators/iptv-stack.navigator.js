/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HeaderBackImage from 'components/header-back-image/header-back-image.component';
import Icon from 'components/icon/icon.component.js';

import IptvScreen from 'screens/iptv/iptv.screen';
import AddIptvScreen from 'screens/iptv/add-iptv.screen';
import EditIptvScreen from 'screens/iptv/edit-iptv.screen';

import { headerHeight } from 'common/values';

import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/nav/nav.actions';
import { createStructuredSelector } from 'reselect';
import { selectSkippedProviderAdd } from 'modules/ducks/user/user.selectors';
import { selectProviders } from 'modules/ducks/provider/provider.selectors';

const Stack = createStackNavigator();

const IptvStack = ({ setBottomTabsVisibleAction, skippedProviderAdd, providers }) => {
  const [initialRoute, setInitialRoute] = React.useState('IPTV');

  React.useEffect(() => {
    setBottomTabsVisibleAction({ hideTabs: false });
  }, []);

  React.useEffect(() => {
    if (!providers.length) {
      setInitialRoute('AddIptvScreen');
    }
    if (skippedProviderAdd) {
      setInitialRoute('IPTV');
    }
  }, [providers, skippedProviderAdd]);
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerTransparent: true,
        headerTintColor: 'white',
        headerBackTitleVisible: false,
        headerBackImage: () => <HeaderBackImage />,
        headerStyle: { height: headerHeight },
        headerTitleStyle: { fontSize: 24 },
        headerTitleContainerStyle: { paddingTop: 0 },
        headerLeftContainerStyle: {
          paddingLeft: 15,
          justifyContent: 'center',
          alignItems: 'center'
        },
        headerRightContainerStyle: styles.headerRightContainerStyle
      }}
    >
      <Stack.Screen
        name="IPTV"
        component={IptvScreen}
        options={({ navigation }) => ({
          animationEnabled: false,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.headerButtonContainer}>
                <Icon name="search" size={24} />
              </View>
              <Pressable
                onPress={() => navigation.navigate('AddIptvScreen')}
                style={styles.headerButtonContainer}
              >
                <Icon name="add" size={24} />
              </Pressable>
            </View>
          )
        })}
      />
      <Stack.Screen
        name="AddIptvScreen"
        component={AddIptvScreen}
        options={{
          title: 'Add IPTV',
          animationEnabled: false,
          headerTitleAlign: 'center'
        }}
        listeners={{
          focus: () => setBottomTabsVisibleAction({ hideTabs: true }),
          beforeRemove: () => setBottomTabsVisibleAction({ hideTabs: false })
        }}
      />
      <Stack.Screen
        name="EditIptvScreen"
        component={EditIptvScreen}
        options={{ headerTitleAlign: 'center', title: 'Edit IPTV' }}
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
    justifyContent: 'center',
    alignItems: 'center'
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

const mapStateToProps = createStructuredSelector({
  skippedProviderAdd: selectSkippedProviderAdd,
  providers: selectProviders
});

export default connect(mapStateToProps, actions)(IptvStack);
