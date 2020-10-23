/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, SafeAreaView, View, ImageBackground, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { withTheme } from 'react-native-paper';

/**
 * Wraps a screen with React Fragment and background
 * @param {string} backgroundType: can either be solid, image, or gradient. default is gradient
 */
const ScreenContainer = ({
  children,
  backgroundType,
  gradientTypeColors,
  theme: {
    iplayya: { colors }
  }
}) => {
  const containerWithBackground = () => {
    if (backgroundType === 'solid') {
      return (
        <View style={{ flex: 1, backgroundColor: colors.goodnight }}>
          <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
        </View>
      );
    }
    if (backgroundType === 'image') {
      return (
        <ImageBackground
          imageStyle={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
          }}
          style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
          source={require('images/Home_BG.png')}
        >
          <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
        </ImageBackground>
      );
    }
    return (
      <LinearGradient style={{ flex: 1 }} colors={gradientTypeColors}>
        <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      </LinearGradient>
    );
  };

  return (
    <React.Fragment>
      <StatusBar barStyle="light-content" />
      {containerWithBackground()}
    </React.Fragment>
  );
};

ScreenContainer.defaultProps = {
  backgroundType: 'gradient',
  gradientTypeColors: ['#2D1449', '#0D0637']
};

ScreenContainer.propTypes = {
  children: PropTypes.any.isRequired,
  backgroundType: PropTypes.string,
  gradientTypeColors: PropTypes.array
};

export default withTheme(ScreenContainer);
