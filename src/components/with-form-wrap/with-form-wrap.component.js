/* eslint-disable react/prop-types */

import React from 'react';
import { Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const withFormWrap = (WrappedComponent) => {
  const formWrap = (props) => {
    if (Platform.OS === 'android') return <WrappedComponent {...props} />;

    return (
      <KeyboardAwareScrollView bounces={false} contentContainerStyle={{ flex: 1 }}>
        <WrappedComponent {...props} />
      </KeyboardAwareScrollView>
    );
  };

  return formWrap;
};

export default withFormWrap;
