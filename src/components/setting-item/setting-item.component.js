import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/icon/icon.component';
import { View, Pressable, StyleSheet } from 'react-native';
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

const SettingItem = ({ icon, label, onPress }) => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const renderIcon = () => {
    if (icon)
      return (
        <View style={styles.iconContainer}>
          <Icon name={icon} size={24} />
        </View>
      );
  };
  return (
    <Pressable style={styles.settingItem} onPress={() => onPress()}>
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
        <View>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        </View>
      </View>
    </Pressable>
  );
};

SettingItem.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func
};

export default SettingItem;
