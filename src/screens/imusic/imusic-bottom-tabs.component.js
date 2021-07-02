import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import theme from 'common/theme';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/music/music.actions';
import { createStructuredSelector } from 'reselect';
import { selectNowPlaying } from 'modules/ducks/music/music.selectors';

// eslint-disable-next-line no-unused-vars
const ImovieBottomTabs = ({ navigation, route, setBottomTabsLayoutInfoAction, nowPlaying }) => {
  const rootComponent = React.useRef();
  const [heartIconColor, setHeartIconColor] = React.useState('white');
  const [downloadIconColor, setDownloadIconColor] = React.useState('white');

  const handleOnRootLayout = ({ nativeEvent }) => {
    setBottomTabsLayoutInfoAction(nativeEvent.layout);
  };

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

  const conditionalStyles = () => {
    if (nowPlaying)
      return {
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0
      };
    return {
      borderTopRightRadius: 24,
      borderTopLeftRadius: 24
    };
  };

  return (
    <SafeAreaView
      ref={rootComponent}
      onLayout={handleOnRootLayout}
      style={{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#202530',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10,
        position: 'absolute',
        width: '100%',
        bottom: 0,
        ...conditionalStyles()
      }}
    >
      <View style={{ flex: 4 }}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('ImovieFavoritesScreen')}
          style={{ alignItems: 'center' }}
        >
          <Icon name="heart-solid" size={24} style={{ color: heartIconColor }} />
          <Text
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              marginTop: 5,
              color: heartIconColor
            }}
          >
            Favorites
          </Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={{ flex: 4 }}>
        <TouchableWithoutFeedback
          onPress={() => navigation.replace('HomeScreen')}
          style={{ flex: 4, alignItems: 'center' }}
        >
          <Icon name="iplayya" size={24} />
          <Text style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={{ flex: 4 }}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('ImovieDownloadsScreen')}
          style={{ alignItems: 'center' }}
        >
          <Icon name="download" size={24} style={{ color: downloadIconColor }} />
          <Text
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              marginTop: 5,
              color: downloadIconColor
            }}
          >
            Downloads
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

ImovieBottomTabs.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  setBottomTabsLayoutInfoAction: PropTypes.func,
  nowPlaying: PropTypes.object
};

const actions = {
  setBottomTabsLayoutInfoAction: Creators.setBottomTabsLayoutInfo
};

const mapStateToProps = createStructuredSelector({ nowPlaying: selectNowPlaying });

export default connect(mapStateToProps, actions)(ImovieBottomTabs);
