/* eslint-disable react/prop-types */

import React from 'react';
import { Dimensions } from 'react-native';
import { View } from 'react-native';
import { useTheme, ActivityIndicator } from 'react-native-paper';

/**
 * TODO: fix z-index so it appears in front of all elements
 * TODO: fix z-index so it appears in front of all elements
 * TODO: fix z-index so it appears in front of all elements
 * TODO: fix z-index so it appears in front of all elements
 * TODO: fix z-index so it appears in front of all elements
 * TODO: fix z-index so it appears in front of all elements
 * TODO: fix z-index so it appears in front of all elements
 * TODO: fix z-index so it appears in front of all elements
 * TODO: fix z-index so it appears in front of all elements
 * TODO: fix z-index so it appears in front of all elements
 * TODO: fix z-index so it appears in front of all elements
 * TODO: fix z-index so it appears in front of all elements
 * TODO: fix z-index so it appears in front of all elements
 * TODO: fix z-index so it appears in front of all elements
 *
 * @param {Component} WrappedComponent the component to enclose with loader
 * @returns a new component with loader
 */
export default function withLoader(WrappedComponent) {
  const Loader = ({ isFetching, ...otherProps }) => {
    const theme = useTheme();
    const renderLoader = () => {
      if (isFetching)
        return (
          <View
            transparent
            statusBarTranslucent
            style={{
              position: 'absolute',
              zIndex: 3,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height
            }}
          >
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          </View>
        );
    };
    return (
      <React.Fragment>
        {renderLoader()}
        <WrappedComponent isFetching={isFetching} {...otherProps} />
      </React.Fragment>
    );
  };

  return Loader;
}
