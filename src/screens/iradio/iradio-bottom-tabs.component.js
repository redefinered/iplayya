import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';
import TabMenuItem from 'components/tab-menu-item/tab-menu-item.component';
import { useNavigation } from '@react-navigation/core';
import Spacer from 'components/spacer.component';

const IradioBottomTabs = ({ nowPlaying }) => {
  const navigation = useNavigation();
  const [bottomPadding, setBottomPadding] = React.useState(null);

  const handleBottomTabsLayoutEvent = ({ nativeEvent }) => {
    const {
      layout: { height }
    } = nativeEvent;

    setBottomPadding(height);
  };

  const handleHomeButtonPress = () => {
    navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
  };

  return (
    <React.Fragment>
      <Spacer size={bottomPadding} />

      <SafeAreaView
        onLayout={handleBottomTabsLayoutEvent}
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: '#202530',
          borderTopRightRadius: nowPlaying ? 0 : 24,
          borderTopLeftRadius: nowPlaying ? 0 : 24,
          paddingHorizontal: 4,
          position: 'absolute',
          width: '100%',
          bottom: 0
        }}
      >
        <TabMenuItem label="Home" icon="iplayya" pressAction={handleHomeButtonPress} />
      </SafeAreaView>
    </React.Fragment>
  );
};

IradioBottomTabs.propTypes = {
  handleBottomTabsLayoutEvent: PropTypes.func,
  nowPlaying: PropTypes.object
};

export default React.memo(IradioBottomTabs);
