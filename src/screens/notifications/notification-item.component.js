import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import moment from 'moment';
import { Creators } from 'modules/ducks/notifications/notifications.actions';
import { connect } from 'react-redux';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const NotificationItem = ({
  id,
  channelName,
  channelId,
  data: { title },
  createdAt,
  status,
  updateNotificationStatusAction,
  handleSelect
}) => {
  const theme = useTheme();
  const navigtation = useNavigation();
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
    // if (!unRead) return;

    // set unread to false
    setUnread(false);

    // navigate to channel
    navigtation.navigate('ChannelDetailScreen', { channelId });

    // set notification status to read
    updateNotificationStatusAction(id, 2);
  };

  return (
    <TouchableHighlight
      onPress={() => handleSelectItem(id)}
      underlayColor={theme.iplayya.colors.black80}
      style={{
        backgroundColor: unRead ? theme.iplayya.colors.white10 : 'transparent',
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
              {`${title} will start in 5 minutes`}
            </Text>
            <Text style={{ fontSize: 10, fontWeight: '300', color: theme.iplayya.colors.white50 }}>
              {renderFromNow()}
            </Text>
          </View>
          <TouchableOpacity onPress={() => handleSelect(id)}>
            <Icon name="more" size={24} />
          </TouchableOpacity>
        </View>
      </ContentWrap>
    </TouchableHighlight>
  );
};

NotificationItem.propTypes = {
  id: PropTypes.string,
  channelName: PropTypes.string,
  channelId: PropTypes.string,
  data: PropTypes.object,
  createdAt: PropTypes.number,
  status: PropTypes.number,
  handleSelect: PropTypes.func,
  updateNotificationStatusAction: PropTypes.func
};

const actions = {
  updateNotificationStatusAction: Creators.updateNotificationStatus
};

export default connect(null, actions)(NotificationItem);
