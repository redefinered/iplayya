/* eslint-disable react/prop-types */

import React from 'react';
import { Modal, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Spacer from 'components/spacer.component';
import DeviceInfo from 'react-native-device-info';
import theme from 'common/theme';
import CastOptions from './cast-options.component';
import { createFontFormat } from 'utils';

const CastOptionsModal = ({ visible, onCancelPress, handleHideList }) => {
  const handleCancelPress = () => {
    onCancelPress(false);
  };

  return (
    <Modal animationType="slide" visible={visible} transparent>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#202530', paddingTop: 20 }}>
          <Text
            style={{
              paddingHorizontal: 15,
              paddingBottom: theme.spacing(2),
              ...createFontFormat(20, 27)
            }}
          >
            Connect to a device
          </Text>
          {/* {renderDeviceList()} */}
          <CastOptions handleHideList={handleHideList} />
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
