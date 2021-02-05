/* eslint-disable react/prop-types */

import React from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Platform } from 'react-native';
import ScreenContainer from 'components/screen-container.component';
import { useHeaderHeight } from '@react-navigation/stack';

const styles = StyleSheet.create({
  container: { flex: 1 }
});

const withFormWrap = (options = {}) => (WrappedComponent) => {
  const { backgroundType, gradientTypeColors } = options;
  const formWrap = (props) => {
    // console.log({ x: navigation });
    const headerHeight = useHeaderHeight();
    return (
      <ScreenContainer backgroundType={backgroundType} gradientTypeColors={gradientTypeColors}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={{ paddingTop: headerHeight }}>
            <WrappedComponent {...props} />
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  };

  return formWrap;
};

export default withFormWrap;
