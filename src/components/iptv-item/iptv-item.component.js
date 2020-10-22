import React from 'react';
import PropTypes from 'prop-types';
import { View, Pressable } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import MinistraThumbnail from 'images/providers/ministra.svg';

const IptvItem = ({
  name,
  username,
  thumbnail,
  theme: {
    roundness,
    iplayya: { colors }
  }
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white10,
      paddingHorizontal: 15,
      marginBottom: 10,
      borderRadius: roundness
    }}
  >
    {thumbnail && (
      <View style={{ flex: 2, alignItems: 'center' }}>
        <MinistraThumbnail />
      </View>
    )}
    <Pressable
      onPress={() => console.log('select provider')}
      style={{
        flex: thumbnail ? 11 : 9,
        paddingHorizontal: thumbnail ? 10 : 0,
        paddingRight: thumbnail ? 0 : 10,
        paddingVertical: 15
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: 'bold', lineHeight: 19, marginBottom: 3 }}>
        {name}
      </Text>
      <Text
        style={{ fontSize: 12, lineHeight: 16, color: colors.white50 }}
      >{`Logged in as ${username}`}</Text>
    </Pressable>
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={() => console.log('more options')}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Icon name="more" size={24} />
      </Pressable>
    </View>
  </View>
);

IptvItem.propTypes = {
  name: PropTypes.string.isRequired,
  username: PropTypes.string,
  thumbnail: PropTypes.string, // an svg component that is imported
  theme: PropTypes.object
};

export default withTheme(IptvItem);
