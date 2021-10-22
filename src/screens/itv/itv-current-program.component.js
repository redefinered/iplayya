import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { createFontFormat } from 'utils';
import moment from 'moment';
// import { selectCurrentProgram } from 'modules/ducks/itv/itv.selectors';
// import { connect } from 'react-redux';

const CurrentProgram = ({ channel }) => {
  const { title: channelTitle, epgtitle, time, time_to } = channel;
  const renderEpgtitle = () => {
    if (!epgtitle)
      return (
        <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
          Program title unavailable
        </Text>
      );

    return (
      <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
        {epgtitle}
      </Text>
    );
  };

  const getSchedule = (time, time_to) => {
    if (!time || !time_to) return;

    return `${moment(time).format('HH:mm A')} - ${moment(time_to).format('HH:mm A')}`;
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ ...createFontFormat(12, 16), marginBottom: 5 }}>{channelTitle}</Text>
      <Text style={{ fontWeight: 'bold', ...createFontFormat(12, 16), marginBottom: 5 }}>
        {renderEpgtitle()}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ ...createFontFormat(12, 16), marginRight: 6 }}>
          {getSchedule(time, time_to)}
        </Text>
        {/* <Icon name="history" color="#13BD38" /> */}
      </View>
    </View>
  );
};

CurrentProgram.propTypes = {
  channel: PropTypes.object
};

// export default CurrentProgram;
export default React.memo(CurrentProgram);
