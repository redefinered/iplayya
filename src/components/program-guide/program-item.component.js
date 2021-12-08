/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import NotifyButton from 'components/button-notify/button-notify.component';
import { compose } from 'redux';
import moment from 'moment';

const ProgramItem = ({
  theme,
  title,
  time,
  isCurrentlyPlaying,
  createScheduledNotif,
  cancelNotification,
  ...otherProgramProps
}) => {
  const [showCancelSnackBar, setShowCancelSnackBar] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    const i = isCurrentlyPlaying(time, otherProgramProps.time_to);
    setIsPlaying(i);
  }, [time, otherProgramProps]);

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowCancelSnackBar(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (showCancelSnackBar) hideSnackBar();
  }, [showCancelSnackBar]);

  const getColor = () => {
    return isPlaying ? theme.iplayya.colors.vibrantpussy : theme.iplayya.colors.white100;
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        height: 50,
        alignItems: 'center',
        marginBottom: 1
      }}
    >
      <View
        style={{
          flex: 3,
          alignItems: 'center',
          justifyContent: 'center',
          height: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.05)'
        }}
      >
        <Text
          style={{
            color: getColor()
          }}
        >
          {moment(time).format('h:mm A')}
        </Text>
      </View>
      <View style={{ flex: 8, paddingLeft: 12 }}>
        <Text style={{ color: getColor() }}>{title}</Text>
      </View>

      <NotifyButton
        createScheduledNotif={createScheduledNotif}
        cancelNotification={cancelNotification}
        program={{ title, time, ...otherProgramProps }}
      />
    </View>
  );
};

ProgramItem.propTypes = {
  theme: PropTypes.object,
  title: PropTypes.string,
  time: PropTypes.string,
  isCurrentlyPlaying: PropTypes.bool
};

const enhance = compose(withTheme);

export default enhance(ProgramItem);
