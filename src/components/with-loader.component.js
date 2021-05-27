/* eslint-disable react/prop-types */

import React from 'react';
import { ActivityIndicator, Dimensions } from 'react-native';
import { View, Modal } from 'react-native';
import { withTheme } from 'react-native-paper';

export default function withScreenLoader(WrappedComponent) {
  const ScreenLoader = ({ theme, isFetching, ...otherProps }) => {
    const renderLoader = () => {
      if (isFetching)
        return (
          <View
            // transparent
            // statusBarTranslucent={true}
            style={{
              position: 'absolute',
              zIndex: 2,
              width: Dimensions.get('window').width,
              height: '100%' // Dimensions.get('window').height
            }}
          >
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <ActivityIndicator color={theme.colors.primary} size="large" />
            </View>
          </View>
        );
    };
    return (
      <React.Fragment>
        {renderLoader()}
        <View style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <WrappedComponent isFetching={isFetching} {...otherProps} />
        </View>
      </React.Fragment>
    );
  };

  return withTheme(ScreenLoader);
}
