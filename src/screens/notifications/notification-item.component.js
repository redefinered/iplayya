import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import moment from 'moment';
import { Creators } from 'modules/ducks/notifications/notifications.actions';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { compose } from 'redux';

const NotificationItem = ({
  theme,
  read,
  notification,
  markNotificationAsReadAction,
  handleSelect
}) => {
  const { id, title, date, channelName, channelId, parentType } = notification.data;

  const navigtation = useNavigation();

  const renderFromNow = () => {
    if (!date) return;

    return moment(date).fromNow();
  };

  // eslint-disable-next-line no-unused-vars
  const handleSelectItem = (id) => {
    // if (!unRead) return;

    // set unread to false
    // setUnread(false);

    // set notification status to read
    markNotificationAsReadAction(notification);

    // navigate to channel
    if (parentType === 'ITV') return navigtation.navigate('ItvChannelDetailScreen', { channelId });

    return navigtation.navigate('IsportsChannelDetailScreen', { channelId });
  };

  const backgroundColor = () => {
    if (read) return theme.iplayya.colors.white10;

    return 'transparent';
  };

  return (
    <Pressable
      onPress={() => handleSelectItem(id)}
      underlayColor={theme.iplayya.colors.black80}
      style={({ pressed }) => ({
        backgroundColor: pressed ? theme.iplayya.colors.black80 : backgroundColor(),
        paddingVertical: theme.spacing(2)
      })}
    >
      <ContentWrap>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <View>
            <Text style={{ fontSize: 14, fontWeight: '700', marginBottom: theme.spacing(1) }}>
              {title}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '300',
                color: theme.iplayya.colors.white50,
                marginBottom: theme.spacing(1)
              }}
            >
              {channelName}
            </Text>
            <Text style={{ fontSize: 10, fontWeight: '300', color: theme.iplayya.colors.white50 }}>
              {renderFromNow()}
            </Text>
          </View>
          <Pressable onPress={() => handleSelect(id)} style={styles.buttonContainer}>
            <Icon name="more" size={theme.iconSize(3)} />
          </Pressable>
        </View>
      </ContentWrap>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

NotificationItem.propTypes = {
  notification: PropTypes.object,
  read: PropTypes.bool,
  theme: PropTypes.object,
  handleSelect: PropTypes.func,
  markNotificationAsReadAction: PropTypes.func
};

const actions = {
  markNotificationAsReadAction: Creators.markNotificationAsRead
};

const enhance = compose(connect(null, actions), withTheme);

export default enhance(NotificationItem);
