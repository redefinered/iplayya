/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import ProgramItem from './program-item.component';
import SelectorPills from 'components/selector-pills/selector-pills.component';
import { generateDatesFromToday } from 'utils';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/itv/itv.actions';
import {
  selectPrograms,
  selectNotifications,
  selectSubscriptions
} from 'modules/ducks/itv/itv.selectors';
import { createFontFormat } from 'utils';
import NotifService from 'NotifService';

import { Button } from 'react-native-paper';

// eslint-disable-next-line no-unused-vars
const ProgramGuide = ({
  programs,
  // notifications,
  subscriptions,
  getProgramsByChannelAction,
  channelId,
  channelName,

  onRegisterAction,
  onNotifAction
}) => {
  const notif = new NotifService(onRegisterAction, onNotifAction);
  // notif.cancelAll();
  const theme = useTheme();
  // generates an array of dates 7 days from now
  const dates = generateDatesFromToday();
  // console.log({ dates });

  const [selected, setSelected] = React.useState('1');

  const handleSelect = (id) => {
    setSelected(id);
    const { value } = dates.find(({ id: dateId }) => dateId === parseInt(id));
    const date = new Date(value).toISOString();
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

  /// CREATE A SCHEDULE NOTIFICATIONS
  const handleCreateScheduledNotif = ({ id, ...rest }) => {
    notif.scheduleNotif({ id, channelId, channelName, program: { id, ...rest } });

    notif.getScheduledLocalNotifications((notifications) => {
      console.log({ notifications });
    });
  };

  /// CANCEL A NOTIFICATION
  const handleCancelScheduledNotif = (id) => {
    console.log({ id });
    notif.cancelNotif(id);

    notif.getScheduledLocalNotifications((notifications) => {
      console.log({ notifications });
    });
  };

  /// for testing
  const checkScheduledNotifs = () => {
    notif.getScheduledLocalNotifications((notifications) => {
      console.log({ notifications });
    });
  };

  /// cancel all
  const cancelAllNotifications = () => {
    notif.cancelAll((notifications) => {
      console.log({ notifications });
    });

    notif.getScheduledLocalNotifications((notifications) => {
      console.log({ notifications });
    });
  };

  // return empty componet if no available programs
  if (!programs.length) return <View />;

  const isSubscriptionActive = (id) => {
    /// return false if notifications is empty
    if (!subscriptions.length) return false;

    const program = subscriptions.find((prog) => id === prog.id);

    /// return false if the program is no yet in notifications
    if (typeof program === 'undefined') return false;

    // if status is falsy i.e. equal 0
    if (!program.status) return false;

    return true;
  };

  // const inSubscriptions = (subscriptionId) => {
  //   const notif = subscriptions.find(({ id }) => id === subscriptionId);

  //   /// if not found return false
  //   if (typeof notif === 'undefined') return false;

  //   return true;
  // };

  return (
    <View>
      {renderTitle()}

      {/* <Button onPress={() => checkScheduledNotifs()}>check scheduled notifications</Button>
      <Button onPress={() => cancelAllNotifications()}>cancel all notifications</Button> */}

      <SelectorPills
        data={dates}
        labelkey="formatted"
        onSelect={handleSelect}
        selected={selected}
        style={{ marginBottom: theme.spacing(2) }}
      />
      {programs.map((program, key) => (
        <ProgramItem
          createScheduledNotif={handleCreateScheduledNotif}
          cancelNotification={handleCancelScheduledNotif}
          // exists={inSubscriptions(program.id)}
          isActive={isSubscriptionActive(program.id)}
          key={key}
          {...program}
        />
      ))}
    </View>
  );
};

ProgramGuide.propTypes = {
  channelId: PropTypes.string,
  channelName: PropTypes.string,
  getProgramsByChannelAction: PropTypes.func,
  programs: PropTypes.array,
  notifications: PropTypes.array,
  subscriptions: PropTypes.array
};

const actions = {
  getProgramsByChannelAction: Creators.getProgramsByChannel,
  onRegisterAction: Creators.onRegister,
  onNotifAction: Creators.onNotif
};

const mapStateToProps = createStructuredSelector({
  programs: selectPrograms,
  notifications: selectNotifications,
  subscriptions: selectSubscriptions
});

export default connect(mapStateToProps, actions)(ProgramGuide);
