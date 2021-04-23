/* eslint-disable react/prop-types */

import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Platform,
  View,
  Dimensions
} from 'react-native';
import ScreenContainer from 'components/screen-container.component';
import { useHeaderHeight } from '@react-navigation/stack';

const winWidth = Dimensions.get('window').width;
//const winHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: { flex: 1 }
});

const withFormWrap = (options = {}) => (WrappedComponent) => {
  const { backgroundType, gradientTypeColors, withLoader } = options;
  const formWrap = (props) => {
    // console.log({ x: navigation });
    const headerHeight = useHeaderHeight();
    return (
      <ScreenContainer
        backgroundType={backgroundType}
        gradientTypeColors={gradientTypeColors}
        withLoader={withLoader}
        isFetching={props.isFetching}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{ height: headerHeight + (winWidth * 0.1) / 2 }} />
          <ScrollView>
            <WrappedComponent {...props} />
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  };

  return formWrap;
};

export default withFormWrap;
