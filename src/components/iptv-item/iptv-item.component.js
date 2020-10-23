import React from 'react';
import PropTypes from 'prop-types';
import { View, Pressable } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import MinistraThumbnail from 'images/providers/ministra.svg';

import styles from './iptv-item.styles';

const IptvItem = ({
  name,
  username,
  thumbnail,
  theme: {
    roundness,
    iplayya: { colors }
  },
  showActions
}) => (
  <View style={{ backgroundColor: colors.white10, borderRadius: roundness, ...styles.container }}>
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
        paddingVertical: 20
      }}
    >
      <Text style={styles.name}>{name}</Text>
      <Text
        style={{ color: colors.white50, ...styles.username }}
      >{`Logged in as ${username}`}</Text>
    </Pressable>
    <View style={styles.iconContainer}>
      <Pressable onPress={() => showActions(true)} style={styles.icon}>
        <Icon name="more" size={24} />
      </Pressable>
    </View>
  </View>
);

IptvItem.propTypes = {
  name: PropTypes.string.isRequired,
  username: PropTypes.string,
  thumbnail: PropTypes.string, // an svg component that is imported
  theme: PropTypes.object,
  showActions: PropTypes.func
};

export default withTheme(IptvItem);
