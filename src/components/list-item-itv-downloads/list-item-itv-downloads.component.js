import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import RadioButton from 'components/radio-button/radio-button.component';
import moment from 'moment';

const ListItemItvDownloads = ({
  id,
  selected,
  channel,
  program,
  startTime,
  endTime,
  handleSelectItem,
  handleLongPress,
  activateCheckboxes
}) => {
  let start = new Date(startTime * 1000);
  let end = new Date(endTime * 1000);

  const renderCheckbox = () => {
    if (!activateCheckboxes) return;
    return <RadioButton selected={selected} />;
  };

  return (
    <Pressable
      onPress={() => handleSelectItem(id)}
      onLongPress={() => handleLongPress(id)}
      key={id}
      style={{ flex: 1, flexDirection: 'row', marginBottom: 1 }}
    >
      <View
        style={{
          flex: 3,
          backgroundColor: 'rgba(255,255,255,0.1)',
          height: 50,
          justifyContent: 'center'
        }}
      >
        <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700' }}>
            {moment(start).format('MMM D')}
          </Text>
          <Text style={{ fontSize: 10, lineHeight: 14 }}>{`${moment(start).format(
            'h:mm'
          )} - ${moment(end).format('h:mm A')}`}</Text>
        </View>
      </View>
      <View
        style={{
          flex: 9,
          backgroundColor: 'rgba(255,255,255,0.05)',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 12, lineHeight: 16 }}>{channel}</Text>
          <Text style={{ fontSize: 12, lineHeight: 16, fontWeight: '700' }}>{program}</Text>
        </View>
        <View style={{ marginRight: 15 }}>{renderCheckbox()}</View>
      </View>
    </Pressable>
  );
};

ListItemItvDownloads.propTypes = {
  id: PropTypes.string,
  selected: PropTypes.bool,
  activateCheckboxes: PropTypes.bool,
  channel: PropTypes.string,
  program: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  handleSelectItem: PropTypes.func,
  handleLongPress: PropTypes.func
};

export default ListItemItvDownloads;
