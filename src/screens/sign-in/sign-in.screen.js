/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView
} from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Logo from 'assets/logo.svg';
import TextInput from 'components/text-input/text-input.component';
import MainButton from 'components/button/mainbutton.component';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import ScreenContainer from 'components/screen-container.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/auth/auth.actions';
import { Creators as AppCreators } from 'modules/app';
import { createStructuredSelector } from 'reselect';
import {
  selectIsFetching,
  selectError,
  selectSignedUp,
  selectIsLoggedIn,
  selectCurrentUser
} from 'modules/ducks/auth/auth.selectors';

import styles from './sign-in.styles';
import withLoader from 'components/with-loader.component';

const SignInScreen = ({
  error: loginError,
  navigation,
  isLoggedIn,
  currentUser,
  appReadyAction,
  signInAction,
  signInStartAction,
  signedUp
}) => {
  // const [state, setState] = React.useState({ username: '', password: '', showPassword });
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState({ username: null, password: null });

  React.useEffect(() => {
    signInStartAction();
  }, []);

  React.useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.email);
    }
  }, [currentUser]);

  React.useEffect(() => {
    appReadyAction();
  }, [isLoggedIn]);

  const handleChangeText = (text, name) => {
    if (name === 'password') return setPassword(text);

    setUsername(text.toLowerCase());
  };

  const handleLoginSubmit = () => {
    if (!username.length) {
      setError({ username: 'Username is required' });
      return;
    }
    if (!password.length) {
      setError({ password: 'Password is required' });
      return;
    }

    /// if no error set errors to null
    setError({ username: null, password: null });

    signInAction({ username, password });
  };

  const renderError = () => {
    const { username, password } = error;

    if (username) return <Text>{username}</Text>;
    if (password) return <Text>{password}</Text>;

    return <Text>{loginError}</Text>;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView behavior="height" bounces={false}>
        <View style={{ flex: 1 }}>
          <StatusBar translucent backgroundColor="transparent" />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 100,
              marginBottom: 30
            }}
          >
            <Logo />
          </View>
          <ContentWrap>
            {signedUp && <Text>Sign-up Success! Please sign in</Text>}
            <TextInput
              name="username"
              handleChangeText={handleChangeText}
              value={username}
              autoCapitalize="none"
              clearButtonMode="while-editing"
              // keyboardType="email-address"
              keyboardType={Platform.OS === 'ios' ? 'email' : 'visible-password'}
              autoCompleteType="email"
              error={error.username}
              style={styles.textInput}
              placeholder="Email"
            />
            <View style={styles.passwordInputContainer}>
              <TextInput
                name="password"
                handleChangeText={handleChangeText}
                value={password}
                autoCapitalize="none"
                error={error.password}
                style={{
                  ...styles.textInput,
                  position: 'relative',
                  zIndex: 1
                }}
                placeholder="Password"
                secureTextEntry={!showPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={{ ...styles.showToggleContainer, zIndex: 2 }}
              >
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={showPassword ? 39 : 40}
                  style={styles.showToggleIcon}
                />
              </Pressable>
            </View>

            {/* errors */}
            {renderError()}

            <MainButton
              onPress={() => handleLoginSubmit()}
              text="Login"
              style={{ marginTop: 30 }}
            />
            <Pressable
              onPress={() => navigation.navigate('ForgotPasswordScreen')}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot passsword?</Text>
            </Pressable>
          </ContentWrap>

          <View style={{ alignItems: 'center', marginBottom: 50 }}>
            <Text>
              Don't you have an account yet?{' '}
              <Text onPress={() => navigation.navigate('SignUpScreen')} style={styles.signUpText}>
                Sign-up
              </Text>
            </Text>
          </View>

          <Pressable style={{ alignItems: 'center', marginBottom: 50 }}>
            <Text style={{ ...styles.signUpText }}>Need help?</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Container = (props) => (
  <ScreenContainer>
    <SignInScreen {...props} />
  </ScreenContainer>
);

SignInScreen.propTypes = {
  signInAction: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  isFetching: selectIsFetching,
  error: selectError,
  signedUp: selectSignedUp,
  isLoggedIn: selectIsLoggedIn,
  currentUser: selectCurrentUser
});

const actions = {
  signInStartAction: Creators.signInStart,
  signInAction: Creators.signIn,
  appReadyAction: AppCreators.appReady
};

const enhance = compose(connect(mapStateToProps, actions), withTheme, withLoader);

export default enhance(Container);
