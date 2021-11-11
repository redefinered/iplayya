import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';
import TabMenuItem from 'components/tab-menu-item/tab-menu-item.component';
import { useNavigation } from '@react-navigation/core';

const IsportsBottomTabs = () => {
  const navigation = useNavigation();

  const handleFavoritesButtonPress = () => {
    navigation.navigate('ItvFavoritesScreen');
  };

  const handleHomeButtonPress = () => {
    navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
  };

  // const handleDownloadButtonPress = () => {
  //   navigation.navigate('ImovieDownloadsScreen');
  // };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#202530',
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
        paddingHorizontal: 4,
        position: 'absolute',
        width: '100%',
        bottom: 0
      }}
    >
      <TabMenuItem label="Favorites" icon="heart-solid" pressAction={handleFavoritesButtonPress} />
      <TabMenuItem label="Home" icon="iplayya" pressAction={handleHomeButtonPress} />
      <TabMenuItem label="Downloads" icon="download" />
    </SafeAreaView>
  );
};

IsportsBottomTabs.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object
};

export default React.memo(IsportsBottomTabs);
