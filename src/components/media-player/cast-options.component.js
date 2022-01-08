/* eslint-disable react/prop-types */

import React from 'react';
import { View, FlatList } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import GoogleCast, { useDevices, useCastDevice } from 'react-native-google-cast';
import { createFontFormat } from 'utils';
import theme from 'common/theme';
import Icon from 'components/icon/icon.component';

const CastOptions = ({ handleHideList }) => {
  const sessionManager = GoogleCast.getSessionManager();
  const gcastDevices = useDevices();
  const castDevice = useCastDevice();

  const handleSelect = async (deviceId) => {
    const active = deviceId === castDevice?.deviceId;

    // if the selected device is already running, stop
    if (active) return;

    await sessionManager.startSession(deviceId);
    // setSelected(deviceId);

    handleHideList();
  };

  // eslint-disable-next-line react/prop-types
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
        // style={{
        //   flexDirection: 'row',
        //   alignItems: 'center',
        //   height: 50,
        //   // backgroundColor: active === deviceId ? theme.iplayya.colors.white10 : 'transparent',
        //   paddingHorizontal: 15
        // }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 50,
            // backgroundColor: active === deviceId ? theme.iplayya.colors.white10 : 'transparent',
            paddingHorizontal: 15
          }}
        >
          <Icon
            name="device-connect"
            size={theme.iconSize(3)}
            color="white"
            style={{ marginRight: theme.spacing(2) }}
          />
          <Text
            style={{
              color: active ? theme.iplayya.colors.vibrantpussy : theme.colors.text,
              ...createFontFormat(16, 22)
            }}
          >
            {friendlyName}
          </Text>
        </View>
      </TouchableRipple>
    );
  };

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
    <FlatList data={gcastDevices} keyExtractor={(item) => item.deviceId} renderItem={renderItem} />
  );
};

export default CastOptions;
