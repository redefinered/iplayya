/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { Creators } from 'modules/ducks/notifications/notifications.actions';
import { connect } from 'react-redux';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { selectNotifications } from 'modules/ducks/notifications/notifications.selectors';
import SnackBar from 'components/snackbar/snackbar.component';

const ProgramItem = ({
  id,
  channelId,
  channelName,
  title,
  time,
  isCurrentlyPlaying,
  parentType,

  subscribeToProgramAction,
  createNotificationAction,
  activateNotificationAction,
  deactivateNotificationAction,
  deleteNotificationAction,

  createScheduledNotif,
  cancelNotification,

  showSnackBar,

  notifications,

  ...rest
}) => {
  const theme = useTheme();
  const [active, setActive] = React.useState(false);
  const [exists, setExists] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const [showCancelSnackBar, setShowCancelSnackBar] = React.useState(false);

  React.useEffect(() => {
    if (notifications.length) {
      const n = notifications.find((n) => n.id === id);

      if (typeof n === 'undefined') {
        return setExists(false);
      } else {
        setExists(true);

        if (n.active) {
          setActive(true);
        } else {
          setActive(false);
        }
      }
    }
  }, [notifications]);

  const handleNotify = () => {
    const program = { id, title, time, ...rest };

    if (exists) {
      if (active) {
        setActive(false);
        deactivateNotificationAction(id);

        cancelNotification(id);
        deleteNotificationAction(id);

        setShowCancelSnackBar(true);
      } else {
        showSnackBar();

        setActive(true);
        activateNotificationAction(id);

        createScheduledNotif(program);
      }

      return;
    }

    showSnackBar();

    createScheduledNotif(program);
    createNotificationAction({
      id,
      channelId,
      channelName,
      status: 0,
      active: true,
      parentType,
      data: program
    });
  };

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowCancelSnackBar(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (showCancelSnackBar) hideSnackBar();
  }, [showCancelSnackBar]);

  const getColor = (time, time_to) => {
    return isCurrentlyPlaying(time, time_to)
      ? theme.iplayya.colors.vibrantpussy
      : theme.iplayya.colors.white100;
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
        <Text
          style={{
            color: getColor(time, rest.time_to)
          }}
        >
          {moment(time).format('h:mm A')}
        </Text>
      </View>
      <View style={{ flex: 8, paddingLeft: 12 }}>
        <Text style={{ color: getColor(time, rest.time_to) }}>{title}</Text>
      </View>
      <Pressable
        onPressIn={() => setIsPressed(true)} // replicates TouchableHighlight
        onPressOut={() => setIsPressed(false)} // replicates TouchableHighlight
        onPress={() => handleNotify()}
        style={{
          marginRight: theme.spacing(2),
          backgroundColor: isPressed ? theme.iplayya.colors.black80 : 'transparent',
          ...styles.button
        }}
      >
        <Icon
          name="notifications"
          size={theme.iconSize(3)}
          color={active ? theme.iplayya.colors.vibrantpussy : 'white'}
        />
      </Pressable>

      <SnackBar
        visible={showCancelSnackBar}
        message="You now turned off the notifications from this program"
        iconName="notifications-off"
        iconColor={theme.iplayya.colors.vibrantpussy}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

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
  activateNotificationAction: PropTypes.func,
  deactivateNotificationAction: PropTypes.func,
  cancelNotificationAction: PropTypes.func,
  showSnackBar: PropTypes.func,
  parentType: PropTypes.string
};

const actions = {
  subscribeToProgramAction: Creators.subscribeToProgram,
  createNotificationAction: Creators.createNotification,
  activateNotificationAction: Creators.activateNotification,
  deactivateNotificationAction: Creators.deactivateNotification,
  cancelNotificationAction: Creators.cancelNotification,
  deleteNotificationAction: Creators.deleteNotification
};

const mapStateToProps = createStructuredSelector({ notifications: selectNotifications });

export default connect(mapStateToProps, actions)(ProgramItem);
