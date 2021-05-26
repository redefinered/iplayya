/* eslint-disable react/prop-types */

import React from 'react';
import { Text } from 'react-native-paper';
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
    errors: [
      { key: 'first_name', val: false },
      { key: 'last_name', val: false },
      { key: 'username', val: false },
      { key: 'email', val: false },
      { key: 'password', val: false },
      { key: 'password_confirmation', val: false }
    ]
  };

  componentDidMount() {
    this.props.registerStartAction();
  }

  handleChange = (value, name) => {
    this.setState({ [name]: value });
  };

  setError = (stateError, field, val) => {
    const index = stateError.findIndex(({ key }) => key === field);
    stateError[index].val = val;
    this.setState({ errors: stateError });
  };

  handleSubmit = () => {
    // eslint-disable-next-line no-unused-vars
    const { errors: stateError, valid, ...rest } = this.state;

    if (!isValidName(rest.first_name)) {
      this.setError(stateError, 'first_name', true);
    } else {
      this.setError(stateError, 'first_name', false);
    }

    if (!isValidName(rest.last_name)) {
      this.setError(stateError, 'last_name', true);
    } else {
      this.setError(stateError, 'last_name', false);
    }

    if (!isValidUsername(rest.username)) {
      this.setError(stateError, 'username', true);
    } else {
      this.setError(stateError, 'username', false);
    }

    if (!isValidEmail(rest.email)) {
      this.setError(stateError, 'email', true);
    } else {
      this.setError(stateError, 'email', false);
    }

    if (!isValidPassword(rest.password)) {
      this.setError(stateError, 'password', true);
    } else {
      this.setError(stateError, 'password', false);
    }

    if (rest.password_confirmation !== rest.password) {
      this.setError(stateError, 'password_confirmation', true);
    } else {
      this.setError(stateError, 'password_confirmation', false);
    }

    if (!isValidPassword(rest.password_confirmation)) {
      this.setError(stateError, 'password_confirmation', true);
    } else {
      this.setError(stateError, 'password_confirmation', false);
    }

    const withError = stateError.find(({ val }) => val === true);
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

    let stateError = {};

    errors.map(({ key, val }) => {
      Object.assign(stateError, { [key]: val });
    });

    return (
      <ContentWrap style={styles.content}>
        <TextInput
          value={mainFields.first_name}
          style={styles.textInput}
          name="first_name"
          placeholder="First name"
          handleChangeText={this.handleChange}
          error={stateError.first_name}
          autoCapitalize="words"
        />
        <TextInput
          value={mainFields.last_name}
          style={styles.textInput}
          name="last_name"
          placeholder="Last name"
          handleChangeText={this.handleChange}
          error={stateError.last_name}
          autoCapitalize="words"
        />
        <TextInput
          autoCapitalize="none"
          value={mainFields.username}
          style={styles.textInput}
          name="username"
          placeholder="Username"
          handleChangeText={this.handleChange}
          error={stateError.username}
        />
        <TextInput
          autoCapitalize="none"
          value={mainFields.email}
          style={styles.textInput}
          name="email"
          placeholder="Email"
          handleChangeText={this.handleChange}
          error={stateError.email}
        />
        <PasswordInput
          value={mainFields.password}
          style={styles.textInput}
          name="password"
          placeholder="Password"
          handleChangeText={this.handleChange}
          error={stateError.password}
        />
        <PasswordInput
          value={mainFields.password_confirmation}
          style={styles.textInput}
          name="password_confirmation"
          placeholder="Confirm password"
          handleChangeText={this.handleChange}
          error={stateError.password_confirmation}
        />

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
