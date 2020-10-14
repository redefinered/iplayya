/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import React from 'react';
import ScreenContainer from 'components/screen-container.component';
import { View, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import Logo from 'images/logo.svg';
import TextInput from 'components/text-input/text-input.component';
import Button from 'components/button/button.component';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';

import styles from './sign-in.styles';

const SignInScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isolatedInputs, setIsolatedInputs] = React.useState(false);

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.logo}>
          <Logo />
        </View>

        <ContentWrap style={styles.form}>
          <TextInput
            autoCapitalize="none"
            clearButtonMode="while-editing"
            autoCompleteType="email"
            style={styles.textInput}
            placeholder="email"
            onFocus={() => setIsolatedInputs(true)}
            onBlur={() => setIsolatedInputs(false)}
          />
          <View style={styles.passwordInputContainer}>
            <TextInput
              autoCapitalize="none"
              style={styles.textInput}
              placeholder="password"
              secureTextEntry={!showPassword}
              onFocus={() => setIsolatedInputs(true)}
              onBlur={() => {
                setShowPassword(false);
                setIsolatedInputs(false);
              }}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.showToggleContainer}
            >
              <Icon
                name={showPassword ? 'close' : 'eye'}
                size={showPassword ? 25 : 40}
                style={styles.showToggleIcon}
              />
            </Pressable>
          </View>
          <Button mode="contained" style={styles.loginButton}>
            Login
          </Button>
          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot passsword?</Text>
          </Pressable>
        </ContentWrap>

        <View style={{ ...styles.signUp }}>
          <Text style={{ display: isolatedInputs ? 'none' : 'flex' }}>
            Don't you have an account yet?{' '}
            <Text onPress={() => navigation.navigate('SignUpScreen')} style={styles.signUpText}>
              Sign-up
            </Text>
          </Text>
        </View>

        <Pressable style={styles.help}>
          <Text style={{ ...styles.signUpText, display: isolatedInputs ? 'none' : 'flex' }}>
            Need help?
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

export default SignInScreen;
