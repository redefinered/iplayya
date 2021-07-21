/* eslint-disable react/prop-types */

import React from 'react';
import { StyleSheet } from 'react-native';
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
              // position: 'absolute',
              // width: Dimensions.get('window').width,
              // height: '100%' /*Dimensions.get('window').height*/
              // flex: 1,
              // zIndex: 99999,
              zIndex: theme.iplayya.zIndex.loader,
              ...StyleSheet.absoluteFillObject
            }}
          >
            <View
              pointerEvents="none"
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)'
              }}
            >
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
