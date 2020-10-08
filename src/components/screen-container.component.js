import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ScreenContainer = ({ children }) => {
  return (
    <React.Fragment>
      <StatusBar barStyle="light-content" />
      <LinearGradient style={{ flex: 1 }} colors={['#2D1449', '#0D0637']}>
        <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      </LinearGradient>
    </React.Fragment>
  );
};

ScreenContainer.propTypes = {
  children: PropTypes.any.isRequired
};

export default ScreenContainer;
