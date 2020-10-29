/* eslint-disable react/prop-types */

import React from 'react';
import { Text } from 'react-native-paper';
import TextInput from 'components/text-input/text-input.component';
import PasswordInput from 'components/password-input/password-input.component';
import Button from 'components/button/button.component';
import ContentWrap from 'components/content-wrap.component';
import withFormWrap from 'components/with-form-wrap/with-form-wrap.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/auth/auth.actions';

import styles from './sign-up.styles';

class SignUpScreen extends React.Component {
  state = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  };

  handleChange = (value, name) => {
    this.setState({ [name]: value });
  };

  handleSubmit = () => {
    const { first_name, last_name, ...rest } = this.state;

    // console.log({ validEmail: isValidEmail(input.email) });
    if (!first_name.length) return;
    if (!last_name.length) return;
    if (!rest.username.length) return;
    if (!rest.email.length) return;
    if (!rest.password.length) return;
    if (!rest.password_confirmation.length) return;

    this.props.registerAction({
      name: `${first_name} ${last_name}`,
      first_name,
      last_name,
      ...rest
    });
  };

  render() {
    const { first_name, last_name, username, email, password, password_confirmation } = this.state;
    return (
      <ContentWrap style={styles.content}>
        <TextInput
          value={first_name}
          style={styles.textInput}
          name="first_name"
          placeholder="First name"
          handleChangeText={this.handleChange}
        />
        <TextInput
          autoCapitalize="words"
          value={last_name}
          style={styles.textInput}
          name="last_name"
          placeholder="Last name"
          handleChangeText={this.handleChange}
        />
        <TextInput
          autoCapitalize="none"
          value={username}
          style={styles.textInput}
          name="username"
          placeholder="Username"
          handleChangeText={this.handleChange}
        />
        <TextInput
          autoCapitalize="none"
          value={email}
          style={styles.textInput}
          name="email"
          placeholder="Email"
          handleChangeText={this.handleChange}
        />
        <PasswordInput
          value={password}
          style={styles.textInput}
          name="password"
          placeholder="Password"
          handleChangeText={this.handleChange}
        />
        <PasswordInput
          value={password_confirmation}
          style={styles.textInput}
          name="password_confirmation"
          placeholder="Confirm password"
          handleChangeText={this.handleChange}
        />

        <Text style={styles.agreement}>
          By tapping Sign Up, you agree to our{' '}
          <Text style={styles.agreementLink} onPress={() => console.log('show sign-up component')}>
            Terms
          </Text>
          .
        </Text>
        <Button style={styles.submit} mode="contained" onPress={() => this.handleSubmit()}>
          Sign Up
        </Button>
      </ContentWrap>
    );
  }
}

const actions = {
  registerAction: Creators.register
};

export default compose(withFormWrap, connect(null, actions))(SignUpScreen);
