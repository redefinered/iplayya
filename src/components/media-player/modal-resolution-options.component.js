/* eslint-disable react/prop-types */

import React from 'react';
import { Modal, View, FlatList } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Spacer from 'components/spacer.component';
import DeviceInfo from 'react-native-device-info';
import { createFontFormat } from 'utils';
import theme from 'common/theme';

const ResolutionsOptionsModal = ({
  visible,
  data,
  handleSelectResolution,
  setShowVideoOptions
}) => {
  const [selected, setSelected] = React.useState(null);

  const handleSelect = (s) => {
    handleSelectResolution(s);
  };

  const handleCancelPress = () => {
    setShowVideoOptions(false);
  };

  const renderItem = ({ item: { name, label } }) => {
    return (
      <TouchableRipple
        onPressIn={() => setSelected(name)}
        onPress={() => handleSelect(name)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 50,
          backgroundColor: selected === name ? theme.iplayya.colors.white10 : 'transparent',
          paddingHorizontal: 15
        }}
      >
        <View style={{ flex: 10.5 }}>
          <Text
            style={{
              color: selected === name ? theme.iplayya.colors.vibrantpussy : theme.colors.text,
              ...createFontFormat(16, 22)
            }}
          >
            {label}
          </Text>
        </View>
      </TouchableRipple>
    );
  };

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#202530', paddingTop: 20 }}>
          <FlatList data={data} keyExtractor={(item) => item.id} renderItem={renderItem} />
          <Spacer size={20} />
          <View
            style={{ width: '100%', height: 1, backgroundColor: theme.iplayya.colors.white10 }}
          />
          <TouchableRipple
            onPress={handleCancelPress}
            style={{
              alignItems: 'center',
              paddingVertical: 20,
              paddingBottom: DeviceInfo.hasNotch() ? 33 : 20
            }}
          >
            <Text>Cancel</Text>
          </TouchableRipple>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(ResolutionsOptionsModal);
