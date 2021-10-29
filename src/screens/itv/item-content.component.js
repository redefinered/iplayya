import React from 'react';
import PropTypes from 'prop-types';
import { View, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { createFontFormat } from 'utils';
import moment from 'moment';

const ItemContent = ({
  channeltitle,
  title,
  epgtitle,
  time,
  time_to,
  onRightActionPress,
  isFavorite
}) => {
  const theme = useTheme();
  const renderEpgtitle = () => {
    if (!epgtitle)
      return (
        <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
          Program title unavailable
        </Text>
      );

    return (
      <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
        {epgtitle}
      </Text>
    );
  };

  const getSchedule = (time, time_to) => {
    if (!time || !time_to) return;

    return `${moment(time).format('HH:mm A')} - ${moment(time_to).format('HH:mm A')}`;
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text style={{ ...createFontFormat(12, 16), marginBottom: 5 }}>
          {title || channeltitle}
        </Text>
        <Pressable onPress={() => onRightActionPress(title)}>
          <Icon
            name="heart-solid"
            size={theme.iconSize(3)}
            style={{ color: isFavorite ? theme.iplayya.colors.vibrantpussy : 'white' }}
          />
        </Pressable>
      </View>
      <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
        {renderEpgtitle()}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ ...createFontFormat(12, 16), marginRight: 6 }}>
            {getSchedule(time, time_to)}
          </Text>
          {/* <Icon name="history" color="#13BD38" /> */}
        </View>
      </View>
    </View>
  );
};

ItemContent.propTypes = {
  channeltitle: PropTypes.string,
  title: PropTypes.string,
  epgtitle: PropTypes.string,
  time: PropTypes.string,
  time_to: PropTypes.string,
  onRightActionPress: PropTypes.func,
  isFavorite: PropTypes.bool
};

export default ItemContent;
