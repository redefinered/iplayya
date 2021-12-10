import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import ProgramItem from './program-item.component';
import SelectorPills from 'components/selector-pills/selector-pills.component';
import { generateDatesFromToday } from 'utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { Creators as NotifCreators } from 'modules/ducks/notifications/notifications.actions';
import {
  selectNotifications,
  selectSubscriptions
} from 'modules/ducks/notifications/notifications.selectors';
import { selectIsFetching } from 'modules/ducks/itv/itv.selectors';
import { createFontFormat } from 'utils';
import { FlatList } from 'react-native-gesture-handler';
import { useHeaderHeight } from '@react-navigation/stack';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { GET_PROGRAMS_BY_CHANNEL } from 'graphql/itv.graphql';
import { selectNotificationService } from 'modules/ducks/notifications/notifications.selectors';

const ITEM_HEIGHT = 50;
const PLAYER_HEIGHT = 211;
const PILLS_HEIGHT = 12 + 40;

const ProgramGuide = ({
  channelId,
  channelName,
  notifService,
  showSnackBar,
  contentHeight,
  screen,
  parentType,
  setCurrentProgram,
  date,
  handleDateSelect
}) => {
  const theme = useTheme();
  const headerHeight = useHeaderHeight();
  // const [notifService, setNotifService] = React.useState(null);
  const [programsPageYOffset, setProgramsPageYOffset] = React.useState(null);
  const [selectedDateId, setSelectedDateId] = React.useState('8');
  const [programs, setPrograms] = React.useState([]);

  const { error, loading, data } = useQuery(GET_PROGRAMS_BY_CHANNEL, {
    variables: {
      input: {
        channelId,
        date
      }
    }
  });

  // console.log({ error, loading, data });

  React.useEffect(() => {
    if (data) {
      setPrograms(data.getPrograms);
    }
  }, [data]);

  // generates an array of dates 7 days from now
  let dates = generateDatesFromToday();
  dates = dates.map(({ id, ...rest }) => ({ id: id.toString(), ...rest }));

  React.useEffect(() => {
    if (selectedDateId !== '8') return;

    setCurrentProgram(programs[0]);
  });

  React.useEffect(() => {
    if (selectedDateId === '8') {
      setCurrentProgram(programs[0]);
    }
  }, [selectedDateId]);

  const handlePillPress = (id) => {
    /// reset programs
    setPrograms([]);

    /// records selected ID for selecting current program
    // this prevents setting current program everytime a date pill is pressed
    setSelectedDateId(id);

    /// set the date ID for fetching programs
    handleDateSelect(id);
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
  const handleCreateScheduledNotif = ({ parentType, ...rest }) => {
    // console.log({ parentType, ...rest });
    notifService.scheduleNotif({
      id: rest.id,
      channelId: rest.channelId,
      channelName: rest.channelName,
      module: parentType,
      program: { id: rest.id, parentType, ...rest }
    });

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
    const today = moment().format('dddd, MMMM Do YYYY');
    const day = moment(startTime).format('dddd, MMMM Do YYYY');

    if (today !== day) return false;

    const a = moment(startTime);
    const b = moment(endTime);

    return moment().isBetween(a, b);
  }, []);

  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item }) => {
    return (
      <ProgramItem
        channelId={channelId}
        channelName={channelName}
        showSnackBar={showSnackBar}
        createScheduledNotif={handleCreateScheduledNotif}
        cancelNotification={handleCancelScheduledNotif}
        isCurrentlyPlaying={isCurrentlyPlaying}
        parentType={parentType}
        {...item}
      />
    );
  };

  const renderProgramsLoader = () => {
    if (loading) {
      return (
        <View style={{ height: ITEM_HEIGHT, justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
  };

  // return empty componet if no available programs
  // if (!programs.length) return <View />;

  const renderSelectorPills = () => {
    if (error) return;

    return (
      <View>
        <SelectorPills
          data={dates}
          labelkey="formatted"
          onSelect={handlePillPress}
          selected={selectedDateId}
          setSelected={setSelectedDateId}
          screen={screen}
        />
      </View>
    );
  };

  return (
    <View>
      {renderTitle()}

      {renderSelectorPills()}

      <View
        onLayout={(event) => {
          event.target.measure((x, y, width, height, pageX, pageY) => {
            setProgramsPageYOffset(pageY);
          });
        }}
      >
        {renderProgramsLoader()}
        <FlatList
          initialScrollIndex={0}
          scrollEnabled
          data={programs}
          getItemLayout={(data, index) => {
            return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
          }}
          // eslint-disable-next-line react/prop-types
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={{ height: Dimensions.get('window').height - programsPageYOffset }}
        />
      </View>
    </View>
  );
};

ProgramGuide.propTypes = {
  isFetching: PropTypes.bool,
  screen: PropTypes.bool,
  date: PropTypes.string,
  dates: PropTypes.array,
  channelId: PropTypes.string,
  parentType: PropTypes.string,
  channelName: PropTypes.string,
  getProgramsByChannelAction: PropTypes.func,
  programs: PropTypes.array,
  notifications: PropTypes.array,
  subscriptions: PropTypes.array,
  showSnackBar: PropTypes.func,
  onRegisterAction: PropTypes.func,
  onNotifAction: PropTypes.func,
  contentHeight: PropTypes.number,
  setCurrentProgram: PropTypes.func,
  onDateSelect: PropTypes.func,
  handleDateSelect: PropTypes.func,
  notifService: PropTypes.any
};

const actions = {
  getProgramsByChannelAction: Creators.getProgramsByChannel,
  onRegisterAction: NotifCreators.onRegister,
  onNotifAction: NotifCreators.onNotif
};

const mapStateToProps = createStructuredSelector({
  isFetching: selectIsFetching,
  notifications: selectNotifications,
  subscriptions: selectSubscriptions,
  notifService: selectNotificationService
});

export default connect(mapStateToProps, actions)(ProgramGuide);
