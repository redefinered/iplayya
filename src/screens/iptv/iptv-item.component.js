/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import MinistraThumbnail from 'assets/providers/ministra.svg';
import RadioButton from 'components/radio-button/radio-button.component';
import MoreButton from 'components/button-more/more-button.component';

const IptvItem = ({
  id,
  name,
  username,
  thumbnail,
  onSelect,
  onActionPress,
  active,
  selected,
  showCheckboxes,
  theme: {
    roundness,
    iplayya: { colors }
  }
}) => {
  const renderActions = () => {
    if (!showCheckboxes) return <MoreButton pressAction={onActionPress} data={{ id }} />;

    return <RadioButton selected={selected} />;
  };

  return (
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
      {renderActions()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10
  },
  name: { fontSize: 14, fontWeight: 'bold', lineHeight: 19, marginBottom: 3 },
  username: { fontSize: 12, lineHeight: 16 },
  icon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: { flex: 1 }
});

IptvItem.propTypes = {
  name: PropTypes.string.isRequired,
  username: PropTypes.string,
  thumbnail: PropTypes.string, // an svg component that is imported
  theme: PropTypes.object,
  showActions: PropTypes.func,
  onSelect: PropTypes.func
};

export default withTheme(IptvItem);
