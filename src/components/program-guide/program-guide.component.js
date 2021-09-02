import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import ProgramItem from './program-item.component';
import SelectorPills from 'components/selector-pills/selector-pills.component';
import { generateDatesFromToday } from 'utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { Creators as NotifCreators } from 'modules/ducks/notifications/notifications.actions';
import { selectPrograms } from 'modules/ducks/itv/itv.selectors';
import {
  selectNotifications,
  selectSubscriptions
} from 'modules/ducks/notifications/notifications.selectors';
import { createFontFormat } from 'utils';
import NotifService from 'NotifService';

// eslint-disable-next-line no-unused-vars
import { Button } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import { useHeaderHeight } from '@react-navigation/stack';
import moment from 'moment';

const ITEM_HEIGHT = 50;
const PLAYER_HEIGHT = 211;
const PILLS_HEIGHT = 12 + 40;

// eslint-disable-next-line no-unused-vars
const ProgramGuide = ({
  programs,
  getProgramsByChannelAction,
  channelId,
  channelName,
  onRegisterAction,
  onNotifAction,
  showSnackBar,
  contentHeight,
  screen
}) => {
  const theme = useTheme();
  const headerHeight = useHeaderHeight();
  // generates an array of dates 7 days from now
  const dates = generateDatesFromToday();
  const [selected, setSelected] = React.useState('8');
  const [notifService, setNotifService] = React.useState(null);
  const [programsPageYOffset, setProgramsPageYOffset] = React.useState(null);

  React.useEffect(() => {
    const notif = new NotifService(onRegisterAction, onNotifAction);
    setNotifService(notif);
  }, []);

  const handleDateSelect = (id) => {
    setSelected(id);
    const { value } = dates.find(({ id: dateId }) => dateId === parseInt(id));
    const date = new Date(value).toISOString();
    console.log({ date });
    getProgramsByChannelAction({ channelId, date });
  };

  const renderTitle = () => {
    if (typeof title === 'undefined') return;

    return (
      <ContentWrap>
        <Text style={{ ...createFontFormat(16, 22), marginBottom: theme.spacing(2) }}>
          Program Guide
        </Text>
      </ContentWrap>
    );
  };

  /// CREATE SCHEDULED NOTIFICATIONS
  const handleCreateScheduledNotif = ({ id, ...rest }) => {
    notifService.scheduleNotif({ id, channelId, channelName, program: { id, ...rest } });

    notifService.getScheduledLocalNotifications((notifications) => {
      console.log({ notifications });
    });
  };

  /// CANCEL A NOTIFICATION
  const handleCancelScheduledNotif = (id) => {
    // console.log({ id });
    notifService.cancelNotif(id);

    notifService.getScheduledLocalNotifications((notifications) => {
      console.log({ notifications });
    });
  };

  /// for testing
  // eslint-disable-next-line no-unused-vars
  const checkScheduledNotifs = () => {
    notifService.getScheduledLocalNotifications((notifications) => {
      console.log({ notifications });
    });
  };

  // /// cancel all
  // eslint-disable-next-line no-unused-vars
  const cancelAllNotifications = () => {
    notifService.cancelAll((notifications) => {
      console.log({ notifications });
    });

    notifService.getScheduledLocalNotifications((notifications) => {
      console.log({ notifications });
    });
  };

  // eslint-disable-next-line no-unused-vars
  const getProgramListHeight = () => {
    if (screen)
      return Dimensions.get('window').height - contentHeight - headerHeight - PILLS_HEIGHT;

    return (
      Dimensions.get('window').height - contentHeight - headerHeight - PLAYER_HEIGHT - PILLS_HEIGHT
    );
  };

  const isCurrentlyPlaying = useCallback((startTime, endTime) => {
    const a = moment(startTime).startOf('hour');
    const b = moment(endTime).endOf('hour');

    return moment().isBetween(a, b);
  }, []);

  const renderItem = (item) => {
    return (
      <ProgramItem
        channelId={channelId}
        channelName={channelName}
        showSnackBar={showSnackBar}
        createScheduledNotif={handleCreateScheduledNotif}
        cancelNotification={handleCancelScheduledNotif}
        isCurrentlyPlaying={isCurrentlyPlaying}
        {...item}
      />
    );
  };

  // const handleLayoutChange = () => {
  //   flatlistref.current.measure((fx, fy, width, height, px, py) => {
  //     console.log('Component width is: ' + width);
  //     console.log('Component height is: ' + height);
  //     console.log('X offset to page: ' + px);
  //     console.log('Y offset to page: ' + py);
  //   });
  // };

  // return empty componet if no available programs
  if (!programs.length) return <View />;

  return (
    <View>
      {renderTitle()}

      <View>
        <SelectorPills
          data={dates}
          labelkey="formatted"
          onSelect={handleDateSelect}
          selected={selected}
          screen={screen}
        />
      </View>
      <View
        onLayout={(event) => {
          event.target.measure((x, y, width, height, pageX, pageY) => {
            setProgramsPageYOffset(pageY);
          });
        }}
      >
        <FlatList
          initialScrollIndex={0}
          scrollEnabled
          data={programs}
          getItemLayout={(data, index) => {
            return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
          }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderItem(item)}
          style={{ height: Dimensions.get('window').height - programsPageYOffset }}
        />
      </View>
    </View>
  );
};

ProgramGuide.propTypes = {
  screen: PropTypes.bool,
  dates: PropTypes.array,
  channelId: PropTypes.string,
  channelName: PropTypes.string,
  getProgramsByChannelAction: PropTypes.func,
  programs: PropTypes.array,
  notifications: PropTypes.array,
  subscriptions: PropTypes.array,
  showSnackBar: PropTypes.func,
  onRegisterAction: PropTypes.func,
  onNotifAction: PropTypes.func,
  contentHeight: PropTypes.number
};

const actions = {
  getProgramsByChannelAction: Creators.getProgramsByChannel,
  onRegisterAction: NotifCreators.onRegister,
  onNotifAction: NotifCreators.onNotif
};

const mapStateToProps = createStructuredSelector({
  programs: selectPrograms,
  notifications: selectNotifications,
  subscriptions: selectSubscriptions
});

export default connect(mapStateToProps, actions)(ProgramGuide);
