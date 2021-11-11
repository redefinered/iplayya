import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { createFontFormat } from 'utils';
import moment from 'moment';

const CurrentProgram = ({ currentProgram, channel }) => {
  const { title: channelTitle } = channel;

  const [program, setProgram] = React.useState(null);

  React.useEffect(() => {
    if (!currentProgram) return;

    setProgram(currentProgram);
  }, [currentProgram]);

  const renderEpgtitle = () => {
    if (!program)
      return (
        <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
          Program title unavailable
        </Text>
      );

    return (
      <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
        {program.title}
      </Text>
    );
  };

  const getSchedule = () => {
    if (!program) return;

    const { time, time_to } = program;

    return `${moment(time).format('HH:mm A')} - ${moment(time_to).format('HH:mm A')}`;
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ ...createFontFormat(12, 16), marginBottom: 5 }}>{channelTitle}</Text>
      <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
        {renderEpgtitle()}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ ...createFontFormat(12, 16), marginRight: 6 }}>{getSchedule()}</Text>
        {/* <Icon name="history" color="#13BD38" /> */}
      </View>
    </View>
  );
};

CurrentProgram.propTypes = {
  channel: PropTypes.object,
  currentProgram: PropTypes.object
};

export default React.memo(CurrentProgram);
