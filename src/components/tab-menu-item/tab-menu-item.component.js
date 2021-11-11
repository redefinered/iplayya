import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import theme from 'common/theme';

const TabMenuItem = ({ pressAction, label, color, icon }) => {
  const [disabled, setDisabled] = React.useState(false);
  const [tint, setTint] = React.useState(color);

  React.useEffect(() => {
    if (!pressAction) {
      setDisabled(true);
      setTint(theme.iplayya.colors.white25);
    }
  }, [pressAction]);

  return (
    <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableRipple
        style={{
          borderRadius: 35,
          height: 70,
          width: 70,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        borderless={Platform.OS !== 'ios'}
        rippleColor="rgba(255,255,255,0.25)"
        onPress={pressAction}
        disabled={disabled}
      >
        <View style={{ alignItems: 'center' }}>
          <Icon name={icon} size={theme.iconSize(3)} color={tint} />
          <Text
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              paddingTop: 2,
              color: tint
            }}
          >
            {label}
          </Text>
        </View>
      </TouchableRipple>
    </View>
  );
};

TabMenuItem.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
  pressAction: PropTypes.func,
  icon: PropTypes.string
};

TabMenuItem.defaultProps = {
  label: 'Menu Label',
  color: 'white'
};

export default React.memo(TabMenuItem);
