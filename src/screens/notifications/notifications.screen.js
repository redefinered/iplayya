/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import SnackBar from 'components/snackbar/snackbar.component';
import NotificationItem from './notification-item.component';
import {
  selectNotifications,
  selectReadNotifications,
  selectNotificationService
} from 'modules/ducks/notifications/notifications.selectors';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import ContentWrap from 'components/content-wrap.component';
import ActionSheet from 'components/action-sheet/action-sheet.component';
import { Creators } from 'modules/ducks/notifications/notifications.actions';
import theme from 'common/theme';
import { FlatList } from 'react-native-gesture-handler';
import { compose } from 'redux';
import withNotifRedirect from 'components/with-notif-redirect.component';

const NotificationsScreen = ({
  navigation,
  notifications,
  deleteNotificationAction,
  notifService
}) => {
  const [selected, setSelected] = React.useState(null);
  const [showActionSheet, setShowActionSheet] = React.useState(false);
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [deliveredItems, setDeliveredItems] = React.useState([]);
  const [list, setList] = React.useState([]);

  const unsubscribe = navigation.addListener('focus', () => {
    notifService.getDeliveredNotifications((notifications) => {
      setDeliveredItems(notifications);
    });
  });

  React.useEffect(() => {
    return () => unsubscribe;
  }, []);

  React.useEffect(() => {
    if (!notifService) return;

    notifService.getDeliveredNotifications((notifications) => {
      setDeliveredItems(notifications);
    });
  }, [notifications]);

  // map list data
  React.useEffect(() => {
    if (!notifications.length) return;

    const ls = notifications.map(({ id, ...rest }) => {
      /// find the item in the delivered notifications list
      const d = deliveredItems.find(({ userInfo }) => userInfo.id === id);

      /// set unread to true if the item is found
      const unread = typeof d === 'undefined';

      /// add the unread property into the item
      return { id, unread, nid: d ? d.identifier : null, ...rest };
    });

    setList(ls);
  }, [deliveredItems, notifications]);

  const handleDeactivateNotification = () => {
    if (!selected) return;

    setShowSnackBar(true);

    handleCancelScheduledNotif(selected);
  };

  /// CANCEL A NOTIFICATION
  const handleCancelScheduledNotif = (id) => {
    // console.log({ id });
    notifService.cancelNotif(id);

    notifService.getScheduledLocalNotifications((notifications) => {
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

  const actions = [
    {
      icon: 'notifications-off',
      title: 'Turn off notification',
      onPress: handleDeactivateNotification
    },
    {
      icon: 'delete',
      title: 'Remove notification',
      onPress: handleDeleteNotification
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
      <ContentWrap style={{ marginTop: theme.spacing(2) }}>
        <Text>No notifications found.</Text>
      </ContentWrap>
    );

  return (
    <View style={{ paddingVertical: theme.spacing(2) }}>
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem notification={item} read={!item.unread} handleSelect={handleSelect} />
        )}
      />
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
  notifications: selectNotifications,
  notifService: selectNotificationService,
  readNotifications: selectReadNotifications
});

const enhance = compose(connect(mapStateToProps, actions), withNotifRedirect);

export default enhance(Container);
