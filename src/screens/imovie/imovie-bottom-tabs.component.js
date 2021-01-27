import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Text } from 'react-native-paper';
import { Icon } from 'components/icon/icon.component';

const ImovieBottomTabs = ({ navigation }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#202530',
      borderTopRightRadius: 24,
      borderTopLeftRadius: 24,
      paddingHorizontal: 30,
      paddingTop: 15,
      paddingBottom: 30,
      position: 'absolute',
      width: '100%',
      bottom: 0
    }}
  >
    <TouchableWithoutFeedback style={{ alignItems: 'center' }}>
      <Icon name="heart-solid" size={40} />
      <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Favorites</Text>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback
      onPress={() => navigation.replace('HomeScreen')}
      style={{ alignItems: 'center' }}
    >
      <Icon name="iplayya" size={40} />
      <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback style={{ alignItems: 'center' }}>
      <Icon name="download" size={40} />
      <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Downloaded</Text>
    </TouchableWithoutFeedback>
  </View>
);

ImovieBottomTabs.propTypes = {
  navigation: PropTypes.object
};

export default ImovieBottomTabs;
