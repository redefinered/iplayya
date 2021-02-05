import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/icon/icon.component';
import { View, StyleSheet } from 'react-native';
import { Text, Switch } from 'react-native-paper';

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  iconContainer: {
    width: 42,
    justifyContent: 'center'
  }
});

const SwitchOption = ({ name, icon, label, value, toggleAction }) => {
  const renderIcon = () => {
    if (icon)
      return (
        <View style={styles.iconContainer}>
          <Icon name={icon} size={24} />
        </View>
      );
  };
  return (
    <View style={styles.settingItem}>
      {renderIcon()}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <View>
          <Text style={{ fontSize: 16, lineHeight: 22 }}>{label}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Switch value={value} onValueChange={() => toggleAction(name)} />
        </View>
      </View>
    </View>
  );
};

SwitchOption.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  toggleAction: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired
};

export default SwitchOption;
