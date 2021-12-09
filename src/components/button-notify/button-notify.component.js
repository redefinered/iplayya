import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View, StyleSheet } from 'react-native';
import { withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import SnackBar from 'components/snackbar/snackbar.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/notifications/notifications.actions';
import { createStructuredSelector } from 'reselect';
import { selectNotifications } from 'modules/ducks/notifications/notifications.selectors';
import moment from 'moment';

const ButtonNotify = ({
  theme,
  notifications,
  program,
  createNotificationAction,
  deleteNotificationAction,
  createScheduledNotif,
  cancelNotification,
  activateNotificationAction,
  deactivateNotificationAction
}) => {
  const [active, setActive] = React.useState(false);
  const [exists, setExists] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [showCancelSnackBar, setShowCancelSnackBar] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    if (showSnackBar) hideSnackBar();
  }, [showSnackBar]);

  React.useEffect(() => {
    if (showCancelSnackBar) hideSnackBar();
  }, [showCancelSnackBar]);

  React.useEffect(() => {
    const { time, time_to } = program;
    const i = isCurrentlyPlaying(time, time_to);
    setIsPlaying(i);
  }, [program]);

  const isCurrentlyPlaying = React.useCallback((startTime, endTime) => {
    const today = moment().format('dddd, MMMM Do YYYY');
    const day = moment(startTime).format('dddd, MMMM Do YYYY');

    if (today !== day) return false;

    const a = moment(startTime);
    const b = moment(endTime);

    return moment().isBetween(a, b);
  }, []);

  React.useEffect(() => {
    if (notifications.length) {
      const n = notifications.find((n) => n.id === program.id);

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

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowSnackBar(false);
      setShowCancelSnackBar(false);
    }, 3000);
  };

  const showRemindSnackBar = () => {
    setShowSnackBar(true);
  };

  // const createScheduledNotif = (program) => {
  //   const { id, channelId, channelName, parentType, ...rest } = program;
  //   notifService.scheduleNotif({
  //     id,
  //     channelId,
  //     channelName,
  //     module: parentType,
  //     program: { id, parentType, ...rest }
  //   });

  //   notifService.getScheduledLocalNotifications((notifications) => {
  //     console.log({ notifications });
  //   });
  // };

  // const cancelNotification = (id) => {
  //   notifService.cancelNotif(id);

  //   notifService.getScheduledLocalNotifications((notifications) => {
  //     console.log({ notifications });
  //   });
  // };

  const handleNotify = () => {
    const { id, channelId, channelName, parentType } = program;

    if (exists) {
      if (active) {
        setActive(false);
        deactivateNotificationAction(id);

        cancelNotification(id);
        deleteNotificationAction(id);

        setShowCancelSnackBar(true);
      } else {
        showRemindSnackBar();

        setActive(true);
        activateNotificationAction(id);

        createScheduledNotif(program);
      }

      return;
    }

    showRemindSnackBar();

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

  // const renderNotificationIcon = () => {
  //   const momentTime = moment(program.time);

  //   if (!program.epgtitle)
  //     return (
  //       <View
  //         style={{
  //           marginRight: theme.spacing(2),
  //           backgroundColor: isPressed ? theme.iplayya.colors.black80 : 'transparent',
  //           ...styles.button
  //         }}
  //       />
  //     );

  //   if (isPlaying || momentTime.isBefore(moment()))
  //     return (
  //       <View
  //         style={{
  //           marginRight: theme.spacing(2),
  //           backgroundColor: isPressed ? theme.iplayya.colors.black80 : 'transparent',
  //           ...styles.button
  //         }}
  //       />
  //     );

  //   return (
  //     <Pressable
  //       onPressIn={() => setIsPressed(true)} // replicates TouchableHighlight
  //       onPressOut={() => setIsPressed(false)} // replicates TouchableHighlight
  //       onPress={() => handleNotify()}
  //       style={{
  //         marginRight: theme.spacing(2),
  //         backgroundColor: isPressed ? theme.iplayya.colors.black80 : 'transparent',
  //         ...styles.button
  //       }}
  //     >
  //       <Icon
  //         name="notifications"
  //         size={theme.iconSize(3)}
  //         color={active ? theme.iplayya.colors.vibrantpussy : 'white'}
  //       />
  //     </Pressable>
  //   );
  // };

  return (
    <React.Fragment>
      {/* {renderNotificationIcon()} */}
      <SnackBar
        visible={showSnackBar}
        message="We will remind you before the program start."
        iconName="notifications"
        iconColor={theme.iplayya.colors.vibrantpussy}
      />
      <SnackBar
        visible={showCancelSnackBar}
        message="You now turned off the notifications from this program"
        iconName="notifications-off"
        iconColor={theme.iplayya.colors.vibrantpussy}
      />
    </React.Fragment>
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

ButtonNotify.propTypes = {
  theme: PropTypes.object,
  notifications: PropTypes.array,
  program: PropTypes.object,
  onNotifAction: PropTypes.func,
  onRegisterAction: PropTypes.func,
  createNotificationAction: PropTypes.func,
  deleteNotificationAction: PropTypes.func,
  activateNotificationAction: PropTypes.func,
  deactivateNotificationAction: PropTypes.func,
  createScheduledNotif: PropTypes.func,
  cancelNotification: PropTypes.func
};

const actions = {
  createNotificationAction: Creators.createNotification,
  activateNotificationAction: Creators.activateNotification,
  deactivateNotificationAction: Creators.deactivateNotification,
  cancelNotificationAction: Creators.cancelNotification,
  deleteNotificationAction: Creators.deleteNotification
};

const mapStateToProps = createStructuredSelector({ notifications: selectNotifications });

const enhance = compose(connect(mapStateToProps, actions), withTheme);

export default enhance(ButtonNotify);
