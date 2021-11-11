import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';
import TabMenuItem from 'components/tab-menu-item/tab-menu-item.component';
import { useNavigation } from '@react-navigation/core';
import { createStructuredSelector } from 'reselect';
import { selectNowPlaying } from 'modules/ducks/music/music.selectors';
import { connect } from 'react-redux';

const ImusicBottomTabs = ({ nowPlaying }) => {
  const navigation = useNavigation();

  const handleFavoritesButtonPress = () => {
    navigation.navigate('ImusicFavoritesScreen');
  };

  const handleHomeButtonPress = () => {
    navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
  };

  const handleDownloadButtonPress = () => {
    navigation.navigate('ImusicDownloadsScreen');
  };

  const borderRadiusStyle = () => {
    if (nowPlaying) {
      return {
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0
      };
    }

    return {
      borderTopRightRadius: 24,
      borderTopLeftRadius: 24
    };
  };

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
        bottom: 0,
        ...borderRadiusStyle()
      }}
    >
      <TabMenuItem label="Favorites" icon="heart-solid" pressAction={handleFavoritesButtonPress} />
      <TabMenuItem label="Home" icon="iplayya" pressAction={handleHomeButtonPress} />
      <TabMenuItem label="Downloads" icon="download" pressAction={handleDownloadButtonPress} />
    </SafeAreaView>
  );
};

ImusicBottomTabs.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  nowPlaying: PropTypes.object
};

const mapStateToProps = () => createStructuredSelector({ nowPlaying: selectNowPlaying });

export default connect(mapStateToProps)(React.memo(ImusicBottomTabs));
