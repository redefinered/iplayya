/* eslint-disable no-unused-vars */

import React from 'react';
import { KeyboardAvoidingView, ScrollView, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
// import ScreenContainer from 'components/screen-container.component';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
import Button from 'components/button/button.component';

import withHeaderPush from 'components/with-header-push/with-header-push.component';
// import { useHeaderHeight } from '@react-navigation/stack';

const styles = StyleSheet.create({
  textInput: { backgroundColor: 'rgba(255,255,255,0.1)' }
});

const ForgotPasswordScreen = () => {
  // const headerHeight = useHeaderHeight();
  return (
    <ContentWrap style={{ paddingTop: 30 }}>
      <Text style={{ marginBottom: 20 }}>
        We will send instructions on how to reset your password in your email that you have
        registered.
      </Text>
      <TextInput style={styles.textInput} placeholder="Email" />
      <Button mode="contained">Send</Button>
    </ContentWrap>
  );
};

/**
 * wrapped with HOC WithHeaderPush to apply the style that pushes
 * the main container down the amount of space the header takes
 */
export default withHeaderPush(ForgotPasswordScreen);
