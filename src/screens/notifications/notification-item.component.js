/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import moment from 'moment';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { connect } from 'react-redux';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const NotificationItem = ({
  id,
  channelName,
  channelId,
  program,
  createdAt,
  read,
  setNotificationToReadAction
}) => {
  const theme = useTheme();
  const navigtation = useNavigation();
  const [unRead, setUnread] = React.useState(true);

  React.useEffect(() => {
    if (read) return setUnread(false);

    setUnread(true);
  }, [read]);

  // eslint-disable-next-line no-unused-vars
  const handleSelectItem = (id) => {
    if (!unRead) return;

    // set unread to false
    setUnread(false);

    // navigate to channel
    navigtation.navigate('ChannelDetailScreen', { channelId });

    // set read to true in state
    setNotificationToReadAction(id);
  };

  console.log({ unRead });

  const { title } = program;
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
              {moment(createdAt).fromNow()}
            </Text>
          </View>
          <Icon name="more" size={24} />
        </View>
      </ContentWrap>
    </TouchableHighlight>
  );
};

NotificationItem.propTypes = {
  setNotificationToReadAction: PropTypes.func
};

const actions = {
  setNotificationToReadAction: Creators.setNotificationToRead
};

export default connect(null, actions)(NotificationItem);
