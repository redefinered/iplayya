import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import theme from 'common/theme';

// eslint-disable-next-line no-unused-vars
const ImovieBottomTabs = ({ navigation, route }) => {
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
          onPress={() => navigation.navigate('ImovieFavoritesScreen')}
        >
          <View style={{ alignItems: 'center' }}>
            <Icon name="heart-solid" size={theme.iconSize(3)} style={{ color: heartIconColor }} />
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
            <Text style={{ fontSize: 10, textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
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
          onPress={() => navigation.navigate('ImovieDownloadsScreen')}
        >
          <View style={{ alignItems: 'center' }}>
            <Icon name="download" size={theme.iconSize(3)} style={{ color: downloadIconColor }} />
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
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
};

ImovieBottomTabs.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object
};

export default ImovieBottomTabs;
