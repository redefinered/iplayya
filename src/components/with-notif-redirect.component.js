/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/notifications/notifications.actions';
import { createStructuredSelector } from 'reselect';
import { selectNotification } from 'modules/ducks/notifications/notifications.selectors';
import { useNavigationState } from '@react-navigation/core';

export default function withNotifRedirect(WrappedComponent) {
  const NotifRedirect = ({
    route,
    navigation,
    notification,
    // markNotificationAsReadAction,
    ...otherProps
  }) => {
    const index = useNavigationState((state) => {
      return state.index;
    });

    React.useEffect(() => {
      if (!notification) return;

      // markNotificationAsReadAction(notification);

      const { channelId, module } = notification.data;

      /// a workaround for screens inside a stack in the tabNavigator
      // pushes to the top of the stack
      if (index > 0) navigation.popToTop();

      // navigates to home so the app is able to reset the navigation without being stuck in
      // the previous screen which is inside a tab navigator
      navigation.navigate('Home');

      navigation.reset({
        index: 1,
        routes: [
          { name: 'HomeScreen', params: { channelId } },
          {
            /// module is ITV or ISPORTS which is the parentType for each notification item
            name: module === 'ITV' ? 'ItvChannelDetailScreen' : 'IsportsChannelDetailScreen',
            params: { channelId }
          }
        ]
      });
    }, [notification]);

    return <WrappedComponent route={route} navigation={navigation} {...otherProps} />;
  };

  const mapStateToProps = createStructuredSelector({ notification: selectNotification });

  return connect(mapStateToProps, {
    markNotificationAsReadAction: Creators.markNotificationAsRead
  })(React.memo(NotifRedirect));
}
