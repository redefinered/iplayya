import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { connect } from 'react-redux';
import moment from 'moment';

const ProgramItem = ({
  id,
  channelId,
  title,
  time,

  createNotificationAction,
  turnOnNotificationAction,
  turnOffNotificationAction,

  exists,
  isActive,

  ...otherProgramProps
}) => {
  const theme = useTheme();
  const handleNotify = () => {
    if (exists) {
      if (isActive) {
        turnOffNotificationAction(id);
      } else {
        turnOnNotificationAction(id);
      }
      return;
    }

    const now = new Date(Date.now());
    createNotificationAction({
      id,
      channelId,
      active: true,
      time,
      createdAt: now.getTime(), /// create a timestamp which is equal to the time at the moment
      program: { title, ...otherProgramProps }
    });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        height: 50,
        alignItems: 'center',
        marginBottom: 1
      }}
    >
      <View
        style={{
          flex: 3,
          alignItems: 'center',
          justifyContent: 'center',
          height: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.05)'
        }}
      >
        <Text>{moment(time).format('h:mm A')}</Text>
      </View>
      <View style={{ flex: 8, paddingLeft: 12 }}>
        <Text>{title}</Text>
      </View>
      <Pressable
        onPress={() => handleNotify()}
        style={{
          flex: 1,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 12
        }}
      >
        <Icon
          name="notifications"
          size={24}
          color={isActive ? theme.iplayya.colors.vibrantpussy : 'white'}
        />
      </Pressable>
    </View>
  );
};

ProgramItem.propTypes = {
  id: PropTypes.string,
  channelId: PropTypes.string,
  title: PropTypes.string,
  time: PropTypes.string,
  exists: PropTypes.bool,
  isActive: PropTypes.bool,
  createNotificationAction: PropTypes.func,
  turnOnNotificationAction: PropTypes.func,
  turnOffNotificationAction: PropTypes.func
};

const actions = {
  createNotificationAction: Creators.createNotification,
  turnOnNotificationAction: Creators.turnOnNotification,
  turnOffNotificationAction: Creators.turnOffNotification
};

export default connect(null, actions)(ProgramItem);
