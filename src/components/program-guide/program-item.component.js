/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View, StyleSheet } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { Creators } from 'modules/ducks/notifications/notifications.actions';
import { connect } from 'react-redux';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { selectNotifications } from 'modules/ducks/notifications/notifications.selectors';
import SnackBar from 'components/snackbar/snackbar.component';
import { compose } from 'redux';

const ProgramItem = ({
  theme,

  id,
  channelId,
  channelName,
  title,
  time,
  time_to,
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
  const [active, setActive] = React.useState(false);
  const [exists, setExists] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const [showCancelSnackBar, setShowCancelSnackBar] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    const i = isCurrentlyPlaying(time, time_to);
    setIsPlaying(i);
  }, [time, time_to]);

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

  const getColor = () => {
    return isPlaying ? theme.iplayya.colors.vibrantpussy : theme.iplayya.colors.white100;
  };

  const renderNotificationIcon = () => {
    if (isPlaying)
      return (
        <View
          style={{
            marginRight: theme.spacing(2),
            backgroundColor: isPressed ? theme.iplayya.colors.black80 : 'transparent',
            ...styles.button
          }}
        />
      );

    return (
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
    );
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
            color: getColor()
          }}
        >
          {moment(time).format('h:mm A')}
        </Text>
      </View>
      <View style={{ flex: 8, paddingLeft: 12 }}>
        <Text style={{ color: getColor() }}>{title}</Text>
      </View>

      {renderNotificationIcon()}

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

const enhance = compose(connect(mapStateToProps, actions), withTheme);

export default enhance(ProgramItem);
