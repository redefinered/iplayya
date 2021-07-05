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
  selectIsLoggedIn
} from 'modules/ducks/auth/auth.selectors';

import styles from './sign-in.styles';
import withLoader from 'components/with-loader.component';
class SignInScreen extends React.Component {
  state = {
    username: '',
    password: '',
    // isolatedInputs: false,
    showPassword: false
  };

  componentDidUpdate(prevProps) {
    if (prevProps.isLoggedIn) {
      this.props.appReadyAction();
    }
  }

  componentDidMount() {
    this.props.signInStartAction();
  }

  handleChangeText = (text, name) => {
    this.setState({ [name]: text });
  };

  handleChangeUsername = (text) => {
    const lowerCase = text.toLowerCase();
    this.setState({ username: lowerCase }); //add toLowerCase
  };

  handleLoginSubmit = () => {
    const { username, password } = this.state;
    const { signInAction } = this.props;
    signInAction({ username, password });
  };

  render() {
    const { showPassword, username, password } = this.state;
    const { navigation } = this.props;

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
              {this.props.signedUp && <Text>Sign-up Success! Please sign in</Text>}
              <TextInput
                name="username"
                handleChangeText={this.handleChangeUsername}
                value={username}
                autoCapitalize="none"
                clearButtonMode="while-editing"
                // keyboardType="email-address"
                keyboardType={Platform.OS === 'ios' ? 'email' : 'visible-password'}
                autoCompleteType="email"
                error={this.props.error}
                style={styles.textInput}
                placeholder="Email"
              />
              <View style={styles.passwordInputContainer}>
                <TextInput
                  name="password"
                  handleChangeText={this.handleChangeText}
                  value={password}
                  autoCapitalize="none"
                  error={this.props.error}
                  style={{
                    ...styles.textInput,
                    position: 'relative',
                    zIndex: 1
                  }}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  onPress={() => this.setState({ showPassword: !showPassword })}
                  style={{ ...styles.showToggleContainer, zIndex: 2 }}
                >
                  <Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={showPassword ? 39 : 40}
                    style={styles.showToggleIcon}
                  />
                </Pressable>
              </View>
              {this.props.error && <Text>{this.props.error}</Text>}
              <MainButton
                onPress={() => this.handleLoginSubmit()}
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

        {/* loader for download starting */}
        {/* <Modal transparent statusBarTranslucent={true} visible={this.props.isFetching}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: this.props.theme.iplayya.colors.black50
            }}
          >
            <ActivityIndicator color={this.props.theme.iplayya.colors.vibrantpussy} />
          </View>
        </Modal> */}
      </KeyboardAvoidingView>
    );
  }
}

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
  isLoggedIn: selectIsLoggedIn
});

const actions = {
  signInStartAction: Creators.signInStart,
  signInAction: Creators.signIn,
  appReadyAction: AppCreators.appReady
};

const enhance = compose(connect(mapStateToProps, actions), withTheme, withLoader);

export default enhance(Container);
