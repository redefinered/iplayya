/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

import React from 'react';
import { StyleSheet, View /*, Pressable*/ } from 'react-native';
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
// import { selectSkippedProviderAdd } from 'modules/ducks/user/user.selectors';
// import { selectProviders } from 'modules/ducks/provider/provider.selectors';
import { selectOnboardinginfo } from 'modules/ducks/profile/profile.selectors';
import { TouchableRipple } from 'react-native-paper';

const Stack = createStackNavigator();

const IptvStack = ({
  setBottomTabsVisibleAction,
  // skippedProviderAdd,
  // providers,
  enableSwipeAction
  // onboardinginfo
}) => {
  // const [initialRoute, setInitialRoute] = React.useState('IPTV');
  // const [skippedProviderAdd, setSkippedProviderAdd] = React.useState(true);

  // React.useEffect(() => {
  //   setBottomTabsVisibleAction({ hideTabs: false });

  //   setInitialRoute('AddIptvScreen');
  // }, []);

  // React.useEffect(() => {
  //   setInitialRoute('AddIptvScreen');
  // });

  // React.useEffect(() => {
  //   console.log({ providers, skippedProviderAdd });
  //   if (!providers.length && !skippedProviderAdd) {
  //     return setInitialRoute('AddIptvScreen');
  //   }
  //   if (skippedProviderAdd) {
  //     setInitialRoute('IPTV');
  //   }
  // }, [providers, skippedProviderAdd]);

  // React.useEffect(() => {
  //   console.log({ onboardinginfo });
  //   if (!onboardinginfo) {
  //     /// adding provider is not yet skipped
  //     return setInitialRoute('AddIptvScreen');
  //   }

  //   const { skippedProviderSetup } = onboardinginfo;

  //   if (typeof skippedProviderSetup === 'undefined') {
  //     /// adding provider is not yet skipped
  //     return setInitialRoute('AddIptvScreen');
  //   } else {
  //     if (skippedProviderSetup) return setInitialRoute('IPTV');
  //   }
  // }, [onboardinginfo]);

  // console.log({ initialRoute });

  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerTintColor: 'white',
        headerBackTitleVisible: false,
        headerBackImage: () => <HeaderBackImage />,
        headerStyle: { height: headerHeight },
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 24, fontWeight: 'normal' },
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
        name="IPTV"
        component={IptvScreen}
        options={({ navigation }) => ({
          animationEnabled: false,
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              {/* <TouchableRipple style={{ padding: 8 }}>
                <View style={{ ...styles.headerButtonContainer }}>
                  <Icon name="search" size={24} />
                </View>
              </TouchableRipple> */}
              <View>
                <TouchableRipple
                  borderless={true}
                  onPress={() => navigation.navigate('AddIptvScreen')}
                  rippleColor="rgba(0,0,0,0.28)"
                  style={{ borderRadius: 44, padding: 8 }}
                >
                  <View style={{ ...styles.headerButtonContainer }}>
                    <Icon name="add" size={24} />
                  </View>
                </TouchableRipple>
              </View>
            </View>
          )
        })}
        listeners={{
          focus: () => enableSwipeAction({ swipeEnabled: true }),
          beforeRemove: () => enableSwipeAction({ swipeEnabled: false })
        }}
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
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerButtonContainer: {
    width: 42,
    height: 42,
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

const mapStateToProps = createStructuredSelector({
  // skippedProviderAdd: selectSkippedProviderAdd,
  onboardinginfo: selectOnboardinginfo
  // providers: selectProviders
});

export default connect(mapStateToProps, actions)(IptvStack);
