import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { createStructuredSelector } from 'reselect';
import { selectNowPlaying } from 'modules/ducks/music/music.selectors';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/music/music.actions';
import theme from 'common/theme';

// eslint-disable-next-line no-unused-vars
const ImusicBottomTabs = ({ navigation, route, nowPlaying, setImusicBottomNavLayoutAction }) => {
  const [heartIconColor, setHeartIconColor] = React.useState('white');
  const [downloadIconColor, setDownloadIconColor] = React.useState('white');

  React.useEffect(() => {
    if (typeof route !== 'undefined') {
      if (route.name === 'ImovieFavoritesScreen') {
        setHeartIconColor(theme.iplayya.colors.vibrantpussy);
      } else {
        setHeartIconColor('white');
      }

      if (route.name === 'ImovieDownloadsScreen') {
        setDownloadIconColor(theme.iplayya.colors.vibrantpussy);
      } else {
        setDownloadIconColor('white');
      }
    }
  }, [route]);

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
      onLayout={({ nativeEvent: { layout } }) => setImusicBottomNavLayoutAction(layout)}
      style={{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#202530',
        paddingHorizontal: 4,
        position: 'absolute',
        width: '100%',
        bottom: 0,
        ...borderRadiusStyle()
      }}
    >
      <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableRipple
          style={{
            borderRadius: 34,
            height: 67,
            width: 67,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          borderless={true}
          rippleColor="rgba(255,255,255,0.25)"
          onPress={() => navigation.navigate('ImusicFavoritesScreen')}
        >
          <View style={{ alignItems: 'center' }}>
            <Icon name="heart-solid" size={theme.iconSize(3)} style={{ color: heartIconColor }} />
            <Text
              style={{
                fontSize: 10,
                textTransform: 'uppercase',
                paddingTop: 5,
                color: heartIconColor
              }}
            >
              Favorites
            </Text>
          </View>
        </TouchableRipple>
      </View>
      <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableRipple
          style={{
            borderRadius: 34,
            height: 67,
            width: 67,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          borderless={true}
          rippleColor="rgba(255,255,255,0.25)"
          onPress={() => navigation.replace('HomeScreen')}
        >
          <View style={{ alignItems: 'center' }}>
            <Icon name="iplayya" size={theme.iconSize(3)} />
            <Text style={{ fontSize: 10, textTransform: 'uppercase', paddingTop: 5 }}>Home</Text>
          </View>
        </TouchableRipple>
      </View>
      <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableRipple
          style={{
            borderRadius: 34,
            height: 69,
            width: 69,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          borderless={true}
          rippleColor="rgba(255,255,255,0.25)"
          onPress={() => navigation.navigate('ImusicDownloadsScreen')}
        >
          <View style={{ alignItems: 'center' }}>
            <Icon name="download" size={theme.iconSize(3)} style={{ color: downloadIconColor }} />
            <Text
              style={{
                fontSize: 10,
                textTransform: 'uppercase',
                paddingTop: 5,
                color: downloadIconColor
              }}
            >
              Downloads
            </Text>
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
};

ImusicBottomTabs.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  nowPlaying: PropTypes.object,
  setImusicBottomNavLayoutAction: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  nowPlaying: selectNowPlaying
});

const actions = { setImusicBottomNavLayoutAction: Creators.setImusicBottomNavLayout };

export default connect(mapStateToProps, actions)(ImusicBottomTabs);
