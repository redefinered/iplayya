/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View, ImageBackground, Dimensions, Text, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme, Portal, ActivityIndicator } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/stack';

const ScreenContainer = ({ children, isFetching, withLoader, backgroundType }) => {
  const theme = useTheme();
  const headerHeight = useHeaderHeight();

  console.log({ backgroundType, withLoader, isFetching });

  const containerWithBackground = () => {
    if (backgroundType === 'solid') {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: theme.iplayya.colors.goodnight,
            paddingTop: headerHeight
          }}
        >
          <View style={{ flex: 1 }}>{children}</View>
        </View>
      );
    }
    if (backgroundType === 'image') {
      return (
        <ImageBackground
          imageStyle={{
            flex: 1,
            width: Dimensions.get('window').width,
            height: '100%', // Dimensions.get('window').height,
            paddingTop: headerHeight
          }}
          style={{
            flex: 1,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
          }}
          source={require('assets/Home_BG.png')}
        >
          <View style={{ flex: 1 }}>{children}</View>
        </ImageBackground>
      );
    }
    return (
      <LinearGradient style={{ flex: 1, paddingTop: headerHeight }} colors={['#2D1449', '#0D0637']}>
        <View style={{ flex: 1 }}>{children}</View>
      </LinearGradient>
    );
  };

  // console.log({ withLoader, isFetching });

  const loader = () => {
    if (isFetching)
      return (
        <Modal
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
        </Modal>
      );
  };

  return (
    <React.Fragment>
      <StatusBar barStyle="light-content" />
      {withLoader && loader()}
      {containerWithBackground()}
    </React.Fragment>
  );
};

ScreenContainer.defaultProps = {
  backgroundType: 'gradient',
  withLoader: false
};

ScreenContainer.propTypes = {
  children: PropTypes.any.isRequired,
  backgroundType: PropTypes.string,
  gradientTypeColors: PropTypes.array
};

export default ScreenContainer;
