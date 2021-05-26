import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View, ImageBackground, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/stack';

const ScreenContainer = ({ children, backgroundType, withHeaderPush }) => {
  const theme = useTheme();
  const headerHeight = useHeaderHeight();

  const containerWithBackground = () => {
    if (backgroundType === 'solid') {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: theme.iplayya.colors.goodnight,
            paddingTop: withHeaderPush ? headerHeight : 0
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
            paddingTop: withHeaderPush ? headerHeight : 0
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
      <LinearGradient
        style={{ flex: 1, paddingTop: withHeaderPush ? headerHeight : 0 }}
        colors={['#2D1449', '#0D0637']}
      >
        <View style={{ flex: 1 }}>{children}</View>
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
  withHeaderPush: false
};

ScreenContainer.propTypes = {
  withHeaderPush: PropTypes.bool,
  children: PropTypes.any.isRequired,
  backgroundType: PropTypes.string,
  gradientTypeColors: PropTypes.array
};

export default ScreenContainer;
