/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Pressable } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import MinistraThumbnail from 'assets/providers/ministra.svg';

import styles from './iptv-item.styles';
import theme from 'common/theme';

const IptvItem = ({
  name,
  username,
  thumbnail,
  theme: {
    roundness,
    iplayya: { colors }
  },
  onSelect,
  onActionPress,
  id,
  active
}) => (
  <Pressable
    onPress={() => onSelect(id)}
    style={{
      backgroundColor: active ? colors.white10 : 'transparent',
      borderRadius: roundness,
      ...styles.container
    }}
  >
    {thumbnail && (
      <View style={{ flex: 2, alignItems: 'center' }}>
        <MinistraThumbnail />
      </View>
    )}
    <View
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
    </View>
    <View style={styles.iconContainer}>
      <Pressable onPress={() => onActionPress(id)} style={styles.icon}>
        <Icon name="more" size={theme.iconSize(3)} />
      </Pressable>
    </View>
  </Pressable>
);

IptvItem.propTypes = {
  name: PropTypes.string.isRequired,
  username: PropTypes.string,
  thumbnail: PropTypes.string, // an svg component that is imported
  theme: PropTypes.object,
  showActions: PropTypes.func,
  onSelect: PropTypes.func
};

export default withTheme(IptvItem);
