/* eslint-disable react/prop-types */

import React from 'react';
import { ActivityIndicator, Dimensions, Modal } from 'react-native';
import { View } from 'react-native';
import { withTheme } from 'react-native-paper';

export default function withScreenLoader(WrappedComponent) {
  const ScreenLoader = ({ theme, isFetching, ...otherProps }) => {
    return (
      <React.Fragment>
        <View
          style={{
            display: isFetching ? 'flex' : 'none',
            position: 'absolute',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
          }}
        >
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </View>
        </View>
        <WrappedComponent isFetching={isFetching} {...otherProps} />
      </React.Fragment>
    );
  };

  return withTheme(ScreenLoader);
}
