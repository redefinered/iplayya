import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';
import TabMenuItem from 'components/tab-menu-item/tab-menu-item.component';
import { useNavigation } from '@react-navigation/core';

const ItvBottomTabs = () => {
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
      <TabMenuItem label="Favorites" pressAction={handleFavoritesButtonPress} />
      <TabMenuItem label="Home" pressAction={handleHomeButtonPress} />
      <TabMenuItem label="Downloads" />
    </SafeAreaView>
  );
};

ItvBottomTabs.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object
};

export default React.memo(ItvBottomTabs);
