/* eslint-disable react/prop-types */

import React from 'react';
import { Modal, View, FlatList } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Spacer from 'components/spacer.component';
import DeviceInfo from 'react-native-device-info';
import GoogleCast, { useDevices, useCastDevice } from 'react-native-google-cast';
import { createFontFormat } from 'utils';
import theme from 'common/theme';

const CastOptionsModal = ({ visible, onCancelPress, handleHideList }) => {
  const gcastDevices = useDevices();
  const castDevice = useCastDevice();
  const sessionManager = GoogleCast.getSessionManager();

  const handleSelect = async (deviceId) => {
    const active = deviceId === castDevice?.deviceId;

    // if the selected device is already running, stop
    if (active) return;

    await sessionManager.startSession(deviceId);
    // setSelected(deviceId);

    handleHideList();
  };

  const handleCancelPress = () => {
    onCancelPress(false);
  };

  const renderItem = ({ item: { deviceId, friendlyName } }) => {
    const active = deviceId === castDevice?.deviceId;
    // ipAddress: "192.168.100.15"
    // deviceId: "210d55e34599077c003417eb7899812a"
    // modelName: "Chromecast"
    // isOnLocalNetwork: true
    // friendlyName: "Red’s TV"
    // deviceVersion: "5"

    return (
      <TouchableRipple
        onPress={() => handleSelect(deviceId)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 50,
          backgroundColor: active === deviceId ? theme.iplayya.colors.white10 : 'transparent',
          paddingHorizontal: 15
        }}
      >
        <Text
          style={{
            color: active === deviceId ? theme.iplayya.colors.vibrantpussy : theme.colors.text,
            ...createFontFormat(16, 22)
          }}
        >
          {friendlyName}
        </Text>
      </TouchableRipple>
    );
  };

  const renderDeviceList = () => {
    if (!gcastDevices.length) {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 50,
            paddingHorizontal: 15
          }}
        >
          <Text
            style={{
              color: theme.colors.text,
              ...createFontFormat(16, 22)
            }}
          >
            No cast device found
          </Text>
        </View>
      );
    }
    return (
      <FlatList
        data={gcastDevices}
        keyExtractor={(item) => item.deviceId}
        renderItem={renderItem}
      />
    );
  };

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#202530', paddingTop: 20 }}>
          {renderDeviceList()}
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

export default React.memo(CastOptionsModal);
