/* eslint-disable react/prop-types */

import React from 'react';
// import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
// import ScreenContainer from 'components/screen-container.component';
import TextInput from 'components/text-input/text-input.component';
import PasswordInput from 'components/password-input/password-input.component';
import Button from 'components/button/button.component';
import ContentWrap from 'components/content-wrap.component';

import withFormWrap from 'components/with-form-wrap/with-form-wrap.component';

import styles from './sign-up.styles';

const SignUpScreen = () => {
  return (
    <ContentWrap style={styles.content}>
      <TextInput style={styles.textInput} placeholder="First name" />
      <TextInput style={styles.textInput} placeholder="Last name" />
      <TextInput style={styles.textInput} placeholder="Username" />
      <TextInput style={styles.textInput} placeholder="Email" />
      <PasswordInput style={styles.textInput} />
      <Text style={styles.agreement}>
        By tapping Sign Up, you agree to our{' '}
        <Text style={styles.agreementLink} onPress={() => console.log('show sign-up component')}>
          Terms
        </Text>
        .
      </Text>
      <Button style={styles.submit} mode="contained">
        Sign Up
      </Button>
    </ContentWrap>
  );
};

export default withFormWrap(SignUpScreen);
