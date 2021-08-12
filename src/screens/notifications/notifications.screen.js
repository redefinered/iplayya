/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import SnackBar from 'components/snackbar/snackbar.component';
import NotificationItem from './notification-item.component';
import { selectNotifications } from 'modules/ducks/notifications/notifications.selectors';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import ContentWrap from 'components/content-wrap.component';
import ActionSheet from 'components/action-sheet/action-sheet.component';
import { Creators } from 'modules/ducks/notifications/notifications.actions';
import NotifService from 'NotifService';

// eslint-disable-next-line no-unused-vars
import { Button } from 'react-native-paper';

const NotificationsScreen = ({
  notifications,
  onRegisterAction,
  onNotifAction,
  deleteNotificationAction
}) => {
  const theme = useTheme();
  const notif = new NotifService(onRegisterAction, onNotifAction);
  const [selected, setSelected] = React.useState(null);
  const [showActionSheet, setShowActionSheet] = React.useState(false);
  const [showSnackBar, setShowSnackBar] = React.useState(true);

  console.log({ selected });

  const handleDeactivateNotification = () => {
    if (!selected) return;

    setShowSnackBar(true);

    handleCancelScheduledNotif(selected);
  };

  /// CANCEL A NOTIFICATION
  const handleCancelScheduledNotif = (id) => {
    // console.log({ id });
    notif.cancelNotif(id);

    notif.getScheduledLocalNotifications((notifications) => {
      console.log({ notifications });
    });

    setSelected(null);
    setShowActionSheet(false);
  };

  const handleDeleteNotification = () => {
    if (!selected) return;

    /// when deleting we also deactivate the notification
    handleCancelScheduledNotif(selected);

    deleteNotificationAction(selected);

    setSelected(null);
    setShowActionSheet(false);
  };

  /// for testing
  const checkScheduledNotifs = () => {
    notif.getScheduledLocalNotifications((notifications) => {
      console.log({ notifications });
    });
  };

  // /// cancel all
  const cancelAllNotifications = () => {
    notif.cancelAll((notifications) => {
      console.log({ notifications });
    });

    notif.getScheduledLocalNotifications((notifications) => {
      console.log({ notifications });
    });
  };

  const actions = [
    {
      icon: 'notifications-off',
      title: 'Turn off notification',
      onPress: handleDeactivateNotification,
      data: 'Male'
    },
    {
      icon: 'delete',
      title: 'Remove notification',
      onPress: handleDeleteNotification,
      data: 'Female'
    }
  ];

  const handleSelect = (id) => {
    setSelected(id);
    setShowActionSheet(true);
  };

  const hideActionSheet = () => {
    setShowActionSheet(false);
  };

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (showSnackBar) hideSnackBar();
  }, [showSnackBar]);

  if (!notifications.length)
    return (
      <ContentWrap>
        <Text>No notifications found.</Text>
      </ContentWrap>
    );

  return (
    <View>
      {/* <Button onPress={() => checkScheduledNotifs()}>check scheduled notifications</Button>
      <Button onPress={() => cancelAllNotifications()}>cancel all scheduled notifications</Button> */}
      {notifications.map((item, key) => (
        <NotificationItem key={key} {...item} handleSelect={handleSelect} />
      ))}
      <ActionSheet visible={showActionSheet} actions={actions} hideAction={hideActionSheet} />
      <SnackBar
        visible={showSnackBar}
        message="You now turned off the notifications from this program"
        iconName="notifications-off"
        iconColor={theme.iplayya.colors.vibrantpussy}
      />
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <NotificationsScreen {...props} />
  </ScreenContainer>
);

NotificationsScreen.propTypes = {
  notifications: PropTypes.array,
  deleteNotificationAction: PropTypes.func
};

const actions = {
  setSelectedForDeactivationAction: Creators.setSelectedForDeactivation,
  onRegisterAction: Creators.onRegister,
  onNotifAction: Creators.onNotif,
  deleteNotificationAction: Creators.deleteNotification
};

const mapStateToProps = createStructuredSelector({
  notifications: selectNotifications
});

export default connect(mapStateToProps, actions)(Container);
