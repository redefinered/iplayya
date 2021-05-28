/* eslint-disable react/prop-types */

import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Platform, View } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1 }
});

const withFormWrap = (WrappedComponent) => {
  const formWrap = (props) => {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1, height: 500 }}>
          <WrappedComponent {...props} />
        </View>
      </KeyboardAvoidingView>
    );
  };

  return formWrap;
};

export default withFormWrap;
