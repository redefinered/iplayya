/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import React from 'react';
import ScreenContainer from 'components/screen-container.component';
import { View, Pressable, KeyboardAvoidingView } from 'react-native';
import { Text } from 'react-native-paper';
import Logo from 'images/logo.svg';
import TextInput from 'components/text-input/text-input.component';
import Button from 'components/button/button.component';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';

import styles from './sign-in.styles';

const SignInScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  console.log({ navigation });
  return (
    <ScreenContainer>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.logo}>
          <Logo />
        </View>

        <ContentWrap style={styles.form}>
          <TextInput
            autoFocus
            autoCapitalize="none"
            clearButtonMode="always"
            autoCompleteType="email"
            style={styles.textInput}
            placeholder="email"
          />
          <View style={{ position: 'relative' }}>
            <TextInput
              autoCapitalize="none"
              style={styles.textInput}
              placeholder="password"
              secureTextEntry={!showPassword}
              onBlur={() => setShowPassword(false)}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 10, height: '100%', justifyContent: 'center' }}
            >
              <Icon name="eye" size={40} />
            </Pressable>
          </View>
          <Button mode="contained" style={styles.loginButton}>
            Login
          </Button>
          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot passsword?</Text>
          </Pressable>
        </ContentWrap>

        <View style={styles.signUp}>
          <Text>
            Don't you have an account yet?{' '}
            <Text onPress={() => navigation.navigate('SignUpScreen')} style={styles.signUpText}>
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
};

export default SignInScreen;
