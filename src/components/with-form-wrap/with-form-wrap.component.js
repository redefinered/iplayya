import React from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Platform } from 'react-native';
import ScreenContainer from 'components/screen-container.component';
import { useHeaderHeight } from '@react-navigation/stack';

const styles = StyleSheet.create({
  container: { flex: 1 }
});

export default function withFormWrap(WrappedComponent, options = {}) {
  const { backgroundType, gradientTypeColors } = options;
  const FormWrap = () => {
    const headerHeight = useHeaderHeight();
    return (
      <ScreenContainer backgroundType={backgroundType} gradientTypeColors={gradientTypeColors}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={{ paddingTop: headerHeight }}>
            <WrappedComponent />
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    );
  };

  return FormWrap;
}
