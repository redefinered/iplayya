/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View, ImageBackground, Dimensions, Text, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { withTheme, Portal, ActivityIndicator } from 'react-native-paper';
import theme from 'common/theme';

/**
 * Wraps a screen with React Fragment and background
 * @param {string} backgroundType: can either be solid, image, or gradient. default is gradient
 */
const ScreenContainer = ({
  children,
  isFetching,
  withLoader,
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
            height: '100%' // Dimensions.get('window').height
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
      <LinearGradient style={{ flex: 1 }} colors={gradientTypeColors}>
        <View style={{ flex: 1 }}>{children}</View>
      </LinearGradient>
    );
  };
  const withLoaderScreen = () => {
    if (!withLoader) return;

    // return <Text style={{ color: 'red' }}>asdasda</Text>;
    // return (
    //   <View
    //     style={{
    //       position: 'absolute',
    //       zIndex: 3,
    //       width: Dimensions.get('window').width,
    //       height: Dimensions.get('window').height
    //     }}
    //   >
    //     <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    //       <ActivityIndicator color={theme.colors.primary} size="large" />
    //     </View>
    //   </View>
    // );

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
      {withLoaderScreen()}
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
