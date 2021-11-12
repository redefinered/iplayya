import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View, ImageBackground, Dimensions, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createStructuredSelector } from 'reselect';
import { selectHeaderHeight } from 'modules/app';
import { connect } from 'react-redux';
import { useHeaderHeight } from '@react-navigation/stack';
import theme from 'common/theme';

const ScreenContainer = ({ children, backgroundType, withHeaderPush }) => {
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
        <LinearGradient
          style={{ ...StyleSheet.absoluteFillObject }}
          colors={['#2D1449', '#0D0637']}
        >
          <ImageBackground
            imageStyle={{
              flex: 1,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height + 70
            }}
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              paddingTop: withHeaderPush ? headerHeight : 0
            }}
            source={require('assets/Home_BG_new.png')}
          >
            <View style={{ flex: 1 }}>{children}</View>
          </ImageBackground>
        </LinearGradient>
      );
    }
    return (
      <LinearGradient
        style={{
          flex: 1,
          paddingTop: withHeaderPush ? headerHeight : 0
        }}
        colors={['#2D1449', '#0D0637']}
      >
        <View style={{ flex: 1 }}>{children}</View>
      </LinearGradient>
    );
  };
  // const withLoaderScreen = () => {
  //   if (!withLoader) return;

  //   if (isFetching)
  //     return (
  //       <View
  //         /*transparent={true} statusBarTranslucent={true}*/ style={{
  //           position: 'absolute',
  //           zIndex: 2,
  //           width: Dimensions.get('window').width,
  //           height: '100%' // Dimensions.get('window').height
  //         }}
  //       >
  //         <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
  //           <ActivityIndicator color={theme.colors.primary} size="large" />
  //         </View>
  //       </View>
  //     );
  // };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      {containerWithBackground()}
    </View>
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
  gradientTypeColors: PropTypes.array,
  headerHeight: PropTypes.number
};

const mapStateToProps = createStructuredSelector({ headerHeight: selectHeaderHeight });

export default connect(mapStateToProps)(ScreenContainer);
