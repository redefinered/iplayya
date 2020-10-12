/* eslint-disable react/prop-types */

import React from 'react';
import { KeyboardAvoidingView, Pressable, Text } from 'react-native';
import ScreenContainer from 'components/screen-container.component';
import TextInput from 'components/text-input/text-input.component';
import Button from 'components/button/button.component';
import ContentWrap from 'components/content-wrap.component';

import { StyleSheet, View } from 'react-native';
import { HeaderHeightContext } from '@react-navigation/stack';

const styles = StyleSheet.create({
  container: { flex: 1 },
  logo: { flex: 3, alignItems: 'center', justifyContent: 'center' },
  form: { flex: 6 },
  loginButton: { marginTop: 6 },
  forgotPassword: { padding: 15, marginTop: 10 },
  forgotPasswordText: { color: 'white', alignSelf: 'center' },
  signUp: { flex: 2, alignItems: 'center' },
  signUpText: { color: '#E34398' },
  help: { flex: 1 },
  helpText: { color: 'white', alignSelf: 'center' }
});

const SignUpScreen = ({ navigation }) => (
  <HeaderHeightContext.Consumer>
    {(headerHeight) => (
      /* using HeaderHeightContext to compensate with the transparent header height */
      <ScreenContainer>
        <KeyboardAvoidingView style={styles.container}>
          <View style={{ height: headerHeight }} />
          <ContentWrap style={styles.form}>
            <TextInput placeholder="email" />
            <TextInput placeholder="password" secureTextEntry />
            <Button mode="contained" style={styles.loginButton}>
              Login
            </Button>
            <Button onPress={() => navigation.navigate('Home')} mode="test" style={styles.loginButton}>
              test
            </Button>
            <Pressable style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot passsword?</Text>
            </Pressable>
          </ContentWrap>
        </KeyboardAvoidingView>
      </ScreenContainer>
    )}
  </HeaderHeightContext.Consumer>
);

export default SignUpScreen;
