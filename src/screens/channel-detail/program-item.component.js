import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import moment from 'moment';

const ProgramItem = ({ title, time }) => {
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
        <Text>{moment(time).format('h:mm A')}</Text>
      </View>
      <View style={{ flex: 8, paddingLeft: 12 }}>
        <Text>{title}</Text>
      </View>
      <View
        style={{
          flex: 1,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 12
        }}
      >
        <Icon name="download" size={24} />
      </View>
    </View>
  );
};

ProgramItem.propTypes = {
  title: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired
};

export default ProgramItem;
