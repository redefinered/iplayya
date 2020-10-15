import React from 'react';
import { KeyboardAvoidingView, View, StyleSheet, Platform } from 'react-native';
import ScreenContainer from 'components/screen-container.component';
import { useHeaderHeight } from '@react-navigation/stack';

const styles = StyleSheet.create({
  container: { flex: 1 }
});

export default function withFormWrap(WrappedComponent) {
  const FormWrap = () => {
    const headerHeight = useHeaderHeight();
    return (
      <ScreenContainer>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{ paddingTop: headerHeight }}>
            <WrappedComponent />
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  };

  return FormWrap;
}
