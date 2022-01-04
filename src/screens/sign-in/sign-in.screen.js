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
  // Dimensions
} from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import Logo from 'assets/logo.svg';
import TextInput from 'components/text-input/text-input.component';
import MainButton from 'components/button/main-button.component';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import ScreenContainer from 'components/screen-container.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/auth/auth.actions';
import { Creators as AppCreators } from 'modules/app';
// import { Creators as UserCreators } from 'modules/ducks/user/user.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectIsFetching,
  selectError,
  selectIsLoggedIn,
  selectCurrentUser
} from 'modules/ducks/auth/auth.selectors';

import styles from './sign-in.styles';
import withLoader from 'components/with-loader.component';

import { isValidEmail } from 'common/validate';
import theme from 'common/theme';
import withNotifRedirect from 'components/with-notif-redirect.component';

const SignInScreen = ({
  error: loginError,
  navigation,
  // isLoggedIn,
  currentUser,
  // appReadyAction,
  signInAction,
  signInStartAction
  // setProviderAction
}) => {
  // const [state, setState] = React.useState({ username: '', password: '', showPassword });
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  // const [containerStyle, setContainerStyle] = React.useState({ flex: 1 });
  const [error, setError] = React.useState({ username: null, password: null, commonError: null });

  React.useEffect(() => {
    signInStartAction();
  }, []);

  React.useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.email);
    }
  }, [currentUser]);

  const handleChangeText = (text, name) => {
    if (name === 'password') return setPassword(text);
    if (name === 'username') {
      if (text === '') {
        setError({ username: null });
      }
    }
    setUsername(text.toLowerCase());
  };

  const handleOnFocus = () => {
    if (!isValidEmail(username)) {
      setError({ username: 'Invalid email address' });
    } else {
      setError({ username: null });
    }
    if (username === '') {
      setError({ username: null });
    }
  };

  const handleLoginSubmit = () => {
    if (error.username || error.password) {
      return;
    }

    signInStartAction();

    if (username === '' && password === '') {
      setError({ commonError: 'Please fill required fields.' });
      return;
    }
    if (username === '') {
      setError({ username: 'Email is required' });
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

  // const handleEvent = ({ nativeEvent }) => {
  //   // if (!layout) return;
  //   // console.log({ nativeEvent });

  //   setContainerStyle({ height: nativeEvent.layout.height });
  // };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      /// removed because it is conflicting with splash screen extended visibility
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // behavior="padding"
    >
      <ScrollView
        // onLayout={handleEvent}
        behavior="height"
        bounces={false}
        // contentContainerStyle={{ height: Dimensions.get('window').height }}
        contentContainerStyle={{ flex: 1 }}
      >
        <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
          <StatusBar translucent backgroundColor="transparent" />
          <View
            style={{
              flex: 3,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Logo />
          </View>
          <ContentWrap>
            <TextInput
              name="username"
              handleChangeText={handleChangeText}
              value={username}
              autoCapitalize="none"
              focusAction={handleOnFocus}
              clearButtonMode="while-editing"
              keyboardType={Platform.OS === 'ios' ? 'email-address' : 'visible-password'}
              autoCompleteType="email"
              error={error.username || loginError || error.commonError}
              style={styles.textInput}
              placeholder="Email"
            />
            {error.username && <Text>{error.username}</Text>}
            <View style={styles.passwordInputContainer}>
              <TextInput
                name="password"
                handleChangeText={handleChangeText}
                value={password}
                focusAction={handleOnFocus}
                autoCapitalize="none"
                error={error.password || loginError || error.commonError}
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
                  size={theme.iconSize(3)}
                  style={styles.showToggleIcon}
                />
              </Pressable>
            </View>
            {error.password && <Text>{error.password}</Text>}
            {loginError && <Text>{loginError}</Text>}
            {error.commonError && <Text>{error.commonError}</Text>}

            <MainButton
              onPress={() => handleLoginSubmit()}
              text="Login"
              style={{ marginTop: 10 }}
            />
            <Pressable
              onPress={() => navigation.navigate('ForgotPasswordScreen')}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot passsword?</Text>
            </Pressable>
          </ContentWrap>

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>
              Don't you have an account yet?{' '}
              <Text onPress={() => navigation.navigate('SignUpScreen')} style={styles.signUpText}>
                Sign Up
              </Text>
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Pressable style={{ alignItems: 'center' }}>
              <Text style={{ color: '#FFFFFF' }}>Need help?</Text>
            </Pressable>
          </View>
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
  isLoggedIn: selectIsLoggedIn,
  currentUser: selectCurrentUser
});

const actions = {
  signInStartAction: Creators.signInStart,
  signInAction: Creators.signIn,
  registerStartAction: Creators.registerStart,
  // setProviderAction: UserCreators.setProvider,
  appReadyAction: AppCreators.appReady
};

const enhance = compose(
  connect(mapStateToProps, actions),
  withTheme,
  withLoader,
  withNotifRedirect
);

export default enhance(Container);
