import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
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
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#202530',
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 30,
        position: 'absolute',
        width: '100%',
        bottom: 0
      }}
    >
      <View style={{ flex: 4 }}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('ImovieFavoritesScreen')}
          style={{ alignItems: 'center' }}
        >
          <Icon name="heart-solid" size={40} style={{ color: heartIconColor }} />
          <Text style={{ textTransform: 'uppercase', marginTop: 5, color: heartIconColor }}>
            Favorites
          </Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={{ flex: 4 }}>
        <TouchableWithoutFeedback
          onPress={() => navigation.replace('HomeScreen')}
          style={{ flex: 4, alignItems: 'center' }}
        >
          <Icon name="iplayya" size={40} />
          <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={{ flex: 4 }}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('ImovieDownloadsScreen')}
          style={{ alignItems: 'center' }}
        >
          <Icon name="download" size={40} style={{ color: downloadIconColor }} />
          <Text style={{ textTransform: 'uppercase', marginTop: 5, color: downloadIconColor }}>
            Downloads
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

ImovieBottomTabs.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object
};

export default ImovieBottomTabs;
