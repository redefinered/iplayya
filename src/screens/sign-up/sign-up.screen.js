/* eslint-disable react/prop-types */

import React from 'react';
import { Text } from 'react-native-paper';
import { Platform } from 'react-native';
import TextInput from 'components/text-input/text-input.component';
import PasswordInput from 'components/password-input/password-input.component';
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

import styles from './sign-up.styles';

import { isValidEmail, isValidName, isValidUsername, isValidPassword } from 'common/validate';

class SignUpScreen extends React.Component {
  state = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    valid: true,
    errors: {
      first_name: null,
      last_name: null,
      username: null,
      email: null,
      password: null,
      password_confirmation: null
    }
  };

  componentDidMount() {
    this.props.registerStartAction();
  }

  handleChange = (value, name) => {
    if (name === 'email') {
      return this.setState({ [name]: value.toLowerCase() });
    }

    if (name === 'username') {
      return this.setState({ [name]: this.onlyOneSpace(value) });
    }

    this.setState({ [name]: value });
  };

  // handleChangeEmail = (value, name) => {
  //   this.setState({ [name]: value.toLowerCase() });
  // };

  // remove space in textInput username
  // handleChangeUsername = (value, name) => {
  //   this.setState({ [name]: this.onlyOneSpace(value) });
  // };

  onlyOneSpace = (str) => {
    return str.trim();
  };

  setError = (field, val) => {
    // const index = stateError.findIndex(({ key }) => key === field);
    // stateError[index].val = val;
    this.setState({ errors: { [field]: val } });
  };

  handleSubmit = () => {
    // eslint-disable-next-line no-unused-vars
    const { errors: stateError, valid, ...rest } = this.state;

    if (!rest.first_name.length) {
      this.setError('first_name', 'First name is required');
    } else {
      if (!isValidName(rest.first_name)) {
        this.setError('first_name', 'Invalid name');
      } else {
        this.setError('first_name', null);
      }
    }

    if (!rest.last_name.length) {
      this.setError('last_name', 'Last name is required');
    } else {
      if (!isValidName(rest.last_name)) {
        this.setError('last_name', 'Invalid last name');
      } else {
        this.setError('last_name', null);
      }
    }

    if (!rest.last_name.length) {
      this.setError('last_name', 'Last name is required');
    } else {
      if (!isValidName(rest.last_name)) {
        this.setError('last_name', 'Invalid last name');
      } else {
        this.setError('last_name', null);
      }
    }

    // if (!isValidName(rest.last_name)) {
    //   this.setError('last_name', 'Invalid last name');
    // } else {
    //   this.setError('last_name', false);
    // }

    if (!rest.username.length) {
      this.setError('username', 'Username is required');
    } else {
      if (!isValidUsername(rest.username)) {
        this.setError('username', 'Invalid username');
      } else {
        this.setError('username', null);
      }
    }

    // if (!isValidUsername(rest.username)) {
    //   this.setError('username', 'Invalid username');
    // } else {
    //   this.setError('username', false);
    // }

    if (!isValidEmail(rest.email) || rest.email.length < 6) {
      this.setError('email', true);
    } else {
      this.setError('email', false);
    }

    if (!isValidPassword(rest.password) || rest.password.length < 8) {
      this.setError('password', true);
    } else {
      this.setError('password', false);
    }

    if (rest.password_confirmation !== rest.password) {
      this.setError('password_confirmation', true);
    } else {
      this.setError('password_confirmation', false);
    }

    if (!isValidPassword(rest.password_confirmation) || rest.password_confirmation < 8) {
      this.setError('password_confirmation', true);
    } else {
      this.setError('password_confirmation', false);
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

  componentDidUpdate(prevProps) {
    if (prevProps.signedUp !== this.props.signedUp) {
      const { navigation, signedUp } = this.props;
      if (signedUp) navigation.goBack();
    }
  }

  render() {
    const { errors, valid, ...mainFields } = this.state;

    // let stateError = {};

    // errors.map(({ key, val }) => {
    //   Object.assign(stateError, { [key]: val });
    // });

    return (
      <ContentWrap style={styles.content}>
        <TextInput
          value={mainFields.first_name}
          style={styles.textInput}
          name="first_name"
          placeholder="First name"
          handleChangeText={this.handleChange}
          error={errors.first_name}
          autoCapitalize="words"
        />
        {errors.first_name && <Text style={{ marginBottom: 10 }}>{errors.first_name}</Text>}
        <TextInput
          value={mainFields.last_name}
          style={styles.textInput}
          name="last_name"
          placeholder="Last name"
          handleChangeText={this.handleChange}
          error={errors.last_name}
          autoCapitalize="words"
        />
        {errors.last_name && <Text style={{ marginBottom: 10 }}>{errors.last_name}</Text>}
        <TextInput
          autoCapitalize="none"
          value={mainFields.username}
          style={styles.textInput}
          name="username"
          placeholder="Username"
          handleChangeText={this.handleChangeUsername}
          error={errors.username}
        />
        {errors.username && <Text style={{ marginBottom: 10 }}>{errors.username}</Text>}
        <TextInput
          autoCapitalize="none"
          value={mainFields.email}
          style={styles.textInput}
          name="email"
          placeholder="Email"
          handleChangeText={this.handleChange}
          keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
          error={errors.email}
        />
        {errors.email && <Text style={{ marginBottom: 10 }}>{errors.email}</Text>}
        <PasswordInput
          value={mainFields.password}
          style={styles.textInput}
          name="password"
          placeholder="Password"
          maxLength={20}
          handleChangeText={this.handleChange}
          error={errors.password}
        />
        {errors.password && <Text style={{ marginBottom: 10 }}>{errors.password}</Text>}
        <PasswordInput
          value={mainFields.password_confirmation}
          style={styles.textInput}
          name="password_confirmation"
          placeholder="Confirm password"
          maxLength={20}
          handleChangeText={this.handleChange}
          error={errors.password_confirmation}
        />
        {errors.password_confirmation && (
          <Text style={{ marginBottom: 10 }}>{errors.password_confirmation}</Text>
        )}

        {!valid ? <Text>There are errors in your entries. Please fix!</Text> : null}
        {this.props.error && <Text>{this.props.error}</Text>}

        <Text style={styles.agreement}>
          By tapping Sign Up, you agree to our{' '}
          <Text style={styles.agreementLink} onPress={() => console.log('show sign-up component')}>
            Terms
          </Text>
          .
        </Text>
        <MainButton onPress={() => this.handleSubmit()} text="Sign Up" style={styles.submit} />
        {/* <Button style={styles.submit} mode="contained" onPress={() => this.handleSubmit()}>
          Sign Up
        </Button> */}
      </ContentWrap>
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
