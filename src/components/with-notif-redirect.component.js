/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectNewNotification } from 'modules/ducks/notifications/notifications.selectors';

export default function withNotifRedirect(WrappedComponent) {
  const NotifRedirect = ({ route, navigation, newNotification, ...otherProps }) => {
    React.useEffect(() => {
      if (!newNotification) return;

      const { channelId, module } = newNotification.data;

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
    }, [newNotification]);

    return <WrappedComponent route={route} navigation={navigation} {...otherProps} />;
  };

  const mapStateToProps = createStructuredSelector({ newNotification: selectNewNotification });

  return connect(mapStateToProps)(NotifRedirect);
}
