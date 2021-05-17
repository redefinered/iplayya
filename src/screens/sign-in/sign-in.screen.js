/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import React from 'react';
import PropTypes from 'prop-types';
import { View, Pressable, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import Logo from 'assets/logo.svg';
import TextInput from 'components/text-input/text-input.component';
import Button from 'components/button/button.component';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/auth/auth.actions';
import { createStructuredSelector } from 'reselect';
import { selectIsFetching, selectError, selectSignedUp } from 'modules/ducks/auth/auth.selectors';

// import withLoader from 'components/with-loader.component';
import withScreenContainer from 'components/with-screen-container/with-screen-container.component';

import styles from './sign-in.styles';

// eslint-disable-next-line no-unused-vars
class SignInScreen extends React.Component {
  state = {
    username: '',
    password: '',
    isolatedInputs: false,
    showPassword: false
  };

  componentDidMount() {
    this.props.signInStartAction();
  }

  handleChangeText = (text, name) => {
    this.setState({ [name]: text });
  };

  handleLoginSubmit = () => {
    const { username, password } = this.state;
    const { signInAction } = this.props;
    signInAction({ username, password });
  };

  render() {
    const { showPassword /*, isolatedInputs*/, username, password } = this.state;
    const { navigation } = this.props;

    // if (this.props.error) console.log({ errorxxx: this.props.error });

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <StatusBar translucent backgroundColor="transparent" />
        <View
          style={{
            flex: 3,
            alignItems: 'center',
            justifyContent: 'center'
            // marginTop: isolatedInputs ? 100 : 0
          }}
        >
          <Logo />
        </View>
        <ContentWrap style={styles.form}>
          {this.props.signedUp && <Text>Sign-up Success! Please sign in</Text>}
          <TextInput
            name="username"
            handleChangeText={this.handleChangeText}
            value={username}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            keyboardType="email-address"
            autoCompleteType="email"
            style={styles.textInput}
            placeholder="email"
            // onFocus={() => this.setState({ isolatedInputs: true })}
            // onBlur={() => this.setState({ isolatedInputs: false })}
          />
          <View style={styles.passwordInputContainer}>
            <TextInput
              name="password"
              handleChangeText={this.handleChangeText}
              value={password}
              autoCapitalize="none"
              style={{
                ...styles.textInput,
                position: 'relative',
                zIndex: 1
              }}
              placeholder="password"
              secureTextEntry={!showPassword}
              // onFocus={() => this.setState({ isolatedInputs: true })}
              // onBlur={() => this.setState({ isolatedInputs: false, showPassword: false })}
            />
            <Pressable
              onPress={() => this.setState({ showPassword: !showPassword })}
              style={{ ...styles.showToggleContainer, zIndex: 2 }}
            >
              <Icon
                name={showPassword ? 'close' : 'eye'}
                size={showPassword ? 25 : 40}
                style={styles.showToggleIcon}
              />
            </Pressable>
          </View>
          {this.props.error && <Text>{this.props.error}</Text>}
          <Button
            mode="contained"
            style={styles.loginButton}
            onPress={() => this.handleLoginSubmit()}
          >
            Login
          </Button>
          <Pressable
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot passsword?</Text>
          </Pressable>
        </ContentWrap>

        <View
          style={{
            ...styles.signUp,
            flex: 1,
            alignItems: 'center'
            // height: isolatedInputs
            //   ? Dimensions.get('window').height - 0.5 * Dimensions.get('window').height
            //   : null
          }}
        >
          <Text>
            Don't you have an account yet?{' '}
            <Text onPress={() => navigation.navigate('SignUpScreen')} style={styles.signUpText}>
              Sign-up
            </Text>
          </Text>
        </View>

        <Pressable style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.signUpText}>Need help?</Text>
        </Pressable>
      </KeyboardAvoidingView>
    );
  }
}

SignInScreen.propTypes = {
  signInAction: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  isFetching: selectIsFetching,
  error: selectError,
  signedUp: selectSignedUp
});

const actions = {
  signInStartAction: Creators.signInStart,
  signInAction: Creators.signIn
};

const enhance = compose(connect(mapStateToProps, actions), withScreenContainer('gradient'));

export default enhance(SignInScreen);
