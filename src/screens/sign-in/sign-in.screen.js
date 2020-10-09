/* eslint-disable react/no-unescaped-entities */

import React from 'react';
import ScreenContainer from 'components/screen-container.component';
import { View, Text, Pressable, KeyboardAvoidingView } from 'react-native';
import Logo from 'images/logo.svg';
import TextInput from 'components/text-input/text-input.component';
import Button from 'components/button/button.component';
import ContentWrap from 'components/content-wrap.component';

import styles from './sign-in.styles';

const SignInScreen = () => (
  <ScreenContainer>
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.logo}>
        <Logo />
      </View>

      <ContentWrap style={styles.form}>
        <TextInput placeholder="email" />
        <TextInput placeholder="password" secureTextEntry />
        <Button mode="contained" style={styles.loginButton}>
          Login
        </Button>
        <Pressable style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot passsword?</Text>
        </Pressable>
      </ContentWrap>

      <View style={styles.signUp}>
        <Text style={{ color: 'white' }}>
          Don't you have an account yet?{' '}
          <Text onPress={() => console.log('test')} style={styles.signUpText}>
            Sign-up
          </Text>
        </Text>
      </View>

      <Pressable style={styles.help}>
        <Text style={styles.signUpText}>Need help?</Text>
      </Pressable>
    </KeyboardAvoidingView>
  </ScreenContainer>
);

export default SignInScreen;
