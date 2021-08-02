/* eslint-disable react/prop-types */
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
  // channelId,
  // channelName,
  title,
  time,

  subscribeToProgramAction,
  // // createNotificationAction,
  activateSubscriptionAction,
  deactivateSubscriptionAction,

  // exists,
  isActive,

  // // ...otherProgramProps,
  // cancelNotificationAction,

  createScheduledNotif,
  cancelNotification,

  ...rest
}) => {
  const theme = useTheme();
  const handleNotify = async () => {
    console.log({ isActive });
    const program = { id, title, time, ...rest };

    if (isActive) {
      deactivateSubscriptionAction(id);
      cancelNotification(id);

      return;
    }

    /// if subscription does not exist or inactive
    await subscribeToProgramAction(1, id);

    activateSubscriptionAction(id);
    createScheduledNotif(program);
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
  channelName: PropTypes.string,
  title: PropTypes.string,
  time: PropTypes.string,
  exists: PropTypes.bool,
  isActive: PropTypes.bool,
  subscribeToProgramAction: PropTypes.func,
  createNotificationAction: PropTypes.func,
  activateSubscriptionAction: PropTypes.func,
  deactivateSubscriptionAction: PropTypes.func,
  cancelNotificationAction: PropTypes.func
};

const actions = {
  subscribeToProgramAction: Creators.subscribeToProgram,
  createNotificationAction: Creators.createNotification,
  activateSubscriptionAction: Creators.activateSubscription,
  deactivateSubscriptionAction: Creators.deactivateSubscription,
  cancelNotificationAction: Creators.cancelNotification
};

export default connect(null, actions)(ProgramItem);
