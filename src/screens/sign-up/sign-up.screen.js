/* eslint-disable react/prop-types */

import React from 'react';
import { Text } from 'react-native-paper';
import { Platform, ScrollView } from 'react-native';
import TextInput from 'components/text-input/text-input.component';
import PasswordInput from 'components/password-input/password-input.component';
import UsernameInput from './username-input.component';
import ScreenContainer from 'components/screen-container.component';
import MainButton from 'components/button/mainbutton.component';
import ContentWrap from 'components/content-wrap.component';
import withFormWrap from 'components/with-form-wrap/with-form-wrap.component';
import withLoader from 'components/with-loader.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/auth/auth.actions';
import { createStructuredSelector } from 'reselect';
import { selectError, selectSignedUp, selectIsFetching } from 'modules/ducks/auth/auth.selectors';
import { validateName } from './sign-up.utils';

import styles from './sign-up.styles';

import {
  isValidEmail,
  isValidName,
  isValidLastName,
  isValidUsername,
  isValidPassword
} from 'common/validate';

class SignUpScreen extends React.Component {
  state = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    valid: true,
    disable: false,
    errors: {
      first_name: null,
      last_name: null,
      username: null,
      email: null,
      password: null,
      password_confirmation: null,
      commonError: null,
      password_validation: null
    }
  };

  componentDidMount() {
    this.props.registerStartAction();

    this.props.navigation.addListener('beforeRemove', () => {
      this.props.registerStartAction();
    });
  }

  handleChange = (value, name) => {
    if (name === 'first_name' || name === 'last_name') {
      if (value === '') {
        this.setError('first_name', null);
      }

      return this.setState({ [name]: validateName(value) });
    }

    if (name === 'email') {
      if (value === '') {
        this.setError('email', null);
        this.props.registerStartAction();
      }
      return this.setState({ [name]: value.toLowerCase().trim() });
    }

    if (name === 'username') {
      if (value === '') {
        this.setError('username', null);
      }

      // prevent non-word characters
      return this.setState({ username: value.replace(/[\W]/g, '') });
    }

    if (name === 'password') {
      if (isValidPassword(value)) {
        this.setError('password_validation', null);
      } else {
        if (value.length) {
          this.setState({ disable: true });
        }
      }
      if (value === '') {
        this.setError('password', null);
        this.setState({ disable: false });
      }

      return this.setState({ [name]: value.replace(/\s/g, '') }); // don't allow spaces
    }

    if (name === 'password_confirmation') {
      if (value === '') {
        this.setError('password_confirmation', null);
      }
      return this.setState({ [name]: value.replace(/\s/g, '') }); // don't allow spaces
    }

    this.setState({ [name]: value });
  };

  handlePasswordFocus = () => {
    if (!isValidEmail(this.state.email)) {
      this.setError('email', 'Invalid email address');
      this.props.registerStartAction();
    } else {
      this.setError('email', null);
    }
    if (this.state.email === '') {
      this.setError('email', null);
    }

    if (!isValidPassword(this.state.password)) {
      this.setError(
        'password_validation',
        '• At least 4 characters in length. \n• Must contain uppercase letters and numbers.'
      );
      this.setError('password', null);
    } else {
      this.setError('password_validation', null);
    }
    if (this.state.first_name === '') {
      this.setError('first_name', null);
    }
    if (this.state.last_name === '') {
      this.setError('last_name', null);
    }
    if (this.state.username === '') {
      this.setError('username', null);
    }
    if (this.state.email === '') {
      this.setError('email', null);
    }
    if (this.state.password === '') {
      this.setError('password', null);
      this.setError('commonError', null);
    }
    if (this.state.password_confirmation === '') {
      this.setError('password_confirmation', null);
    }
  };

  handleOnFocus = () => {
    if (!isValidEmail(this.state.email)) {
      this.setError('email', 'Invalid email address');
      this.props.registerStartAction();
    } else {
      this.setError('email', null);
    }
    if (this.state.email === '') {
      this.setError('email', null);
    }

    if (this.state.password === '') {
      this.setError('password_validation', null);
      this.setError('password', null);
    }

    if (this.state.first_name.length < 3) {
      this.setError('first_name', 'At least 3 characters in length.');
    } else {
      this.setError('first_name', null);
    }
    if (this.state.first_name === '') {
      this.setError('first_name', null);
    }

    if (this.state.last_name.length < 2) {
      this.setError('last_name', 'At least 2 characters in length.');
    } else {
      this.setError('last_name', null);
    }
    if (this.state.last_name === '') {
      this.setError('last_name', null);
      this.setError('commonError', null);
    }

    if (this.state.username.length < 2) {
      this.setError('username', 'At least 2 characters in length.');
    } else {
      this.setError('username', null);
    }
    if (this.state.username === '') {
      this.setError('username', null);
    }

    if (this.state.password_confirmation === '') {
      this.setError('password_confirmation', null);
    }
  };

  setError = (field, val) => {
    // const index = stateError.findIndex(({ key }) => key === field);
    // stateError[index].val = val;
    this.setState({ errors: Object.assign(this.state.errors, { [field]: val }) });
  };

  handleSubmit = () => {
    // eslint-disable-next-line no-unused-vars
    const { errors: stateError, valid, disable, ...rest } = this.state;

    if (
      rest.first_name === '' &&
      rest.last_name === '' &&
      rest.username === '' &&
      rest.email === '' &&
      rest.password === '' &&
      rest.password_confirmation === ''
    ) {
      this.setError('commonError', 'Please fill the required fields.');
      this.setError('password_validation', null);
      return;
    } else {
      this.setError('commonError', null);
    }

    if (!rest.first_name.length) {
      this.setError('first_name', 'First name is required');
    } else {
      if (!isValidName(rest.first_name)) {
        this.setError('first_name', 'At least 3 characters in length.');
      } else {
        this.setError('first_name', null);
      }
    }

    if (!rest.last_name.length) {
      this.setError('last_name', 'Last name is required');
    } else {
      if (!isValidLastName(rest.last_name)) {
        this.setError('last_name', 'At least 2 characters in length.');
      } else {
        this.setError('last_name', null);
      }
    }

    if (!rest.username.length) {
      this.setError('username', 'Username is required');
    } else {
      if (!isValidUsername(rest.username)) {
        this.setError('username', 'At least 2 characters in length.');
      } else {
        this.setError('username', null);
      }
    }

    if (!rest.email.length) {
      this.setError('email', 'Email is required');
    } else {
      if (!isValidEmail(rest.email)) {
        this.setError('email', 'Invalid email address.');
        this.props.registerStartAction();
      } else {
        this.setError('email', null);
      }
    }

    if (!rest.password.length) {
      this.setError('password', 'Password is required');
      this.setError('password_validation', null);
    } else {
      if (!isValidPassword(rest.password)) {
        this.setError(
          'password',
          '• At least 4 characters in length. \n• Must contain uppercase letters and numbers.'
        );
        this.setError('password_validation', null);
      } else {
        this.setError('password', null);
      }
    }

    if (!rest.password_confirmation.length) {
      this.setError('password_confirmation', 'Password is required');
    } else {
      this.setError('password_confirmation', null);
    }

    if (rest.password_confirmation !== rest.password) {
      this.setError('password_confirmation', 'Passwords did not match');
    } else {
      this.setError('password_confirmation', null);
    }

    const withError = Object.keys(stateError)
      .map((key) => ({ key, val: stateError[key] }))
      .find(({ val }) => val !== null);

    if (typeof withError !== 'undefined') {
      return this.setState({ valid: false });
    } else {
      this.setState({ valid: true });
    }

    console.log('no errors! submit.');

    this.props.registerAction({
      name: `${rest.first_name} ${rest.last_name}`,
      ...rest
    });
  };

  /// handle email error
  componentDidUpdate(prevProps) {
    // if (prevProps.signedUp !== this.props.signedUp) {
    //   const { navigation, signedUp } = this.props;
    //   if (signedUp) navigation.goBack();
    // }

    if (prevProps.error !== this.props.error) {
      /// if there is change in auth state error
      const { error } = this.props;

      if (error === 'EMAIL_ERROR') {
        return this.setError('email', 'The email has already been taken.');
      }
    }
  }

  render() {
    const { errors, ...formFields } = this.state; //remove valid

    // console.log({ errors });
    return (
      <ScrollView>
        <ContentWrap style={styles.content}>
          <TextInput
            value={formFields.first_name}
            style={styles.textInput}
            name="first_name"
            placeholder="First name"
            focusAction={this.handleOnFocus}
            handleChangeText={this.handleChange}
            error={errors.first_name || errors.commonError}
            autoCapitalize="words"
          />
          {errors.first_name && <Text style={{ marginBottom: 10 }}>{errors.first_name}</Text>}
          <TextInput
            value={formFields.last_name}
            style={styles.textInput}
            name="last_name"
            placeholder="Last name"
            focusAction={this.handleOnFocus}
            handleChangeText={this.handleChange}
            error={errors.last_name || errors.commonError}
            autoCapitalize="words"
          />
          {errors.last_name && <Text style={{ marginBottom: 10 }}>{errors.last_name}</Text>}

          {/* separated to another component for username real-time validation */}
          <UsernameInput
            formFields={formFields}
            styles={styles}
            handleOnFocus={this.handleOnFocus}
            handleChange={this.handleChange}
            errors={errors}
            setError={this.setError}
          />
          {errors.username && <Text style={{ marginBottom: 10 }}>{errors.username}</Text>}

          <TextInput
            autoCapitalize="none"
            value={formFields.email}
            style={styles.textInput}
            focusAction={this.handleOnFocus}
            name="email"
            placeholder="Email"
            handleChangeText={this.handleChange}
            keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
            error={errors.email || errors.commonError}
          />
          {errors.email && <Text style={{ marginBottom: 10 }}>{errors.email}</Text>}
          <PasswordInput
            value={formFields.password}
            style={styles.textInput}
            name="password"
            placeholder="Password"
            maxLength={20}
            focusAction={this.handlePasswordFocus}
            handleChangeText={this.handleChange}
            error={errors.password || errors.commonError}
          />
          {errors.password_validation ? (
            <Text style={{ marginBottom: 10 }}>{errors.password_validation}</Text>
          ) : null}
          {errors.password && <Text style={{ marginBottom: 10 }}>{errors.password}</Text>}
          <PasswordInput
            value={formFields.password_confirmation}
            style={styles.textInput}
            name="password_confirmation"
            placeholder="Confirm password"
            maxLength={20}
            editable={this.state.disable}
            selectTextOnFocus={this.state.disable}
            focusAction={this.handleOnFocus}
            handleChangeText={this.handleChange}
            error={errors.password_confirmation || errors.commonError}
          />
          {/* {this.props.error && <Text style={{ marginBottom: 10 }}>{this.props.error}</Text>} */}
          {errors.password_confirmation && (
            <Text style={{ marginBottom: 10 }}>{errors.password_confirmation}</Text>
          )}
          {errors.commonError ? (
            <Text style={{ marginBottom: 10 }}>{errors.commonError}</Text>
          ) : null}
          {/* {!valid ? <Text>Please fill required fields.</Text> : null} */}

          <Text style={styles.agreement}>
            By tapping Sign Up, you agree to our{' '}
            <Text
              style={styles.agreementLink}
              onPress={() => console.log('show sign-up component')}
            >
              Terms
            </Text>
            .
          </Text>
          <MainButton onPress={() => this.handleSubmit()} text="Sign Up" style={styles.submit} />
        </ContentWrap>
      </ScrollView>
    );
  }
}

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <SignUpScreen {...props} />
  </ScreenContainer>
);

const actions = {
  registerStartAction: Creators.registerStart,
  registerAction: Creators.register
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  signedUp: selectSignedUp
});

const enhance = compose(connect(mapStateToProps, actions), withFormWrap, withLoader);

export default enhance(Container);
