/* eslint-disable react/prop-types */

import React from 'react';
import { ActivityIndicator, Modal } from 'react-native';
import { View } from 'react-native';
import { withTheme } from 'react-native-paper';

export default function withScreenLoader(WrappedComponent) {
  const ScreenLoader = ({ theme, isFetching, ...otherProps }) => {
    console.log({ isFetching });
    return (
      <React.Fragment>
        <Modal animationType="none" transparent visible={isFetching}>
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </View>
        </Modal>
        <WrappedComponent isFetching={isFetching} {...otherProps} />
      </React.Fragment>
    );
  };

  return withTheme(ScreenLoader);
}
