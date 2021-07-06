/* eslint-disable react/prop-types */

import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Platform, ScrollView } from 'react-native';

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
        <ScrollView bounces={false} style={{ flex: 1, height: 500 }}>
          <WrappedComponent {...props} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  return formWrap;
};

export default withFormWrap;
