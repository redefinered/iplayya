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
import { selectNotificationService } from 'modules/ducks/notifications/notifications.selectors';
import { createStructuredSelector } from 'reselect';

const NotificationItem = ({
  theme,
  read,
  notification,
  // markNotificationAsReadAction,
  handleSelect,

  // eslint-disable-next-line react/prop-types
  notifService
}) => {
  const { id, title, date, channelName, channelId, parentType } = notification.data;

  const navigtation = useNavigation();

  const renderFromNow = () => {
    if (!date) return;

    return moment(date).fromNow();
  };

  // eslint-disable-next-line no-unused-vars
  const handleSelectItem = () => {
    // console.log({ nid });
    // this will remove the item to the delivered notifications
    if (notification.nid) {
      notifService.removeDeliveredNotifs([notification.nid]);
    }

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
      onPress={handleSelectItem}
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
  notifService: PropTypes.any
};

const actions = {
  markNotificationAsReadAction: Creators.markNotificationAsRead
};

const mapStateToProps = createStructuredSelector({ notifService: selectNotificationService });

const enhance = compose(connect(mapStateToProps, actions), withTheme);

export default enhance(NotificationItem);
