import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import moment from 'moment';
import { Creators } from 'modules/ducks/notifications/notifications.actions';
import { connect } from 'react-redux';
// import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const NotificationItem = ({
  id,
  channelName,
  channelId,
  data: { title },
  createdAt,
  status,
  updateNotificationStatusAction,
  handleSelect,
  parentType
}) => {
  const theme = useTheme();
  const navigtation = useNavigation();
  const [isPressed, setIsPressed] = React.useState(false);
  const [unRead, setUnread] = React.useState(false);

  React.useEffect(() => {
    /**
     * statuses
     * 0: pending
     * 1: delivered
     * 2: read
     */
    switch (status) {
      case 1:
        setUnread(true);
        break;
      case 2:
        setUnread(false);
        break;
      default:
        setUnread(false);
    }
  }, [status]);

  const renderFromNow = () => {
    if (!createdAt) return;

    return moment(createdAt).fromNow();
  };

  // eslint-disable-next-line no-unused-vars
  const handleSelectItem = (id) => {
    if (!unRead) return;

    // set unread to false
    setUnread(false);

    // set notification status to read
    updateNotificationStatusAction(id, 2);

    // navigate to channel
    if (parentType === 'ITV') return navigtation.navigate('ItvChannelDetailScreen', { channelId });
    return navigtation.navigate('IsportsChannelDetailScreen', { channelId });
  };

  const backgroundColor = () => {
    if (unRead) {
      return theme.iplayya.colors.white10;
    } else {
      if (isPressed) return theme.iplayya.colors.black80;

      return 'transparent';
    }
  };

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)} // replicates TouchableHighlight
      onPressOut={() => setIsPressed(false)} // replicates TouchableHighlight
      onPress={() => handleSelectItem(id)}
      underlayColor={theme.iplayya.colors.black80}
      style={{
        backgroundColor: backgroundColor(),
        paddingVertical: theme.spacing(2)
      }}
    >
      <ContentWrap>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <View>
            <Text style={{ fontSize: 14, fontWeight: '700', marginBottom: theme.spacing(1) }}>
              {channelName}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '300',
                color: theme.iplayya.colors.white50,
                marginBottom: theme.spacing(1)
              }}
            >
              {title}
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
  id: PropTypes.string,
  channelName: PropTypes.string,
  channelId: PropTypes.string,
  data: PropTypes.object,
  createdAt: PropTypes.number,
  status: PropTypes.number,
  handleSelect: PropTypes.func,
  updateNotificationStatusAction: PropTypes.func,
  parentType: PropTypes.string
};

const actions = {
  updateNotificationStatusAction: Creators.updateNotificationStatus
};

export default connect(null, actions)(NotificationItem);
