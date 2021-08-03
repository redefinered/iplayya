import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import NotificationItem from './notification-item.component';
import { selectNotifications } from 'modules/ducks/notifications/notifications.selectors';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import ContentWrap from 'components/content-wrap.component';

const NotificationsScreen = ({ notifications }) => {
  if (!notifications.length)
    return (
      <ContentWrap>
        <Text>No notifications found.</Text>
      </ContentWrap>
    );

  return (
    <View>
      {notifications.map((item, key) => (
        <NotificationItem key={key} {...item} />
      ))}
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <NotificationsScreen {...props} />
  </ScreenContainer>
);

NotificationsScreen.propTypes = {
  notifications: PropTypes.array
};

const mapStateToProps = createStructuredSelector({ notifications: selectNotifications });

export default connect(mapStateToProps)(Container);
