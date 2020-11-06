/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Button from 'components/button/button.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import PasswordInput from 'components/password-input/password-input.component';

import withHeaderPush from 'components/with-header-push/with-header-push.component';
import withLoader from 'components/with-loader.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/auth/auth.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectResetPasswordParams,
  selectResetMessage
} from 'modules/ducks/auth/auth.selectors';

import { isValidPassword } from 'common/validate';

const styles = StyleSheet.create({
  textInput: { backgroundColor: 'rgba(255,255,255,0.1)' }
});

class ResetPasswordScreen extends React.Component {
  state = {
    modalVisible: false,
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

  handleChange = (value, name) => {
    this.setState({ [name]: value });
  };

  setError = (stateError, field, val) => {
    const index = stateError.findIndex(({ key }) => key === field);
    stateError[index].val = val;
    this.setState({ errors: stateError });
  };

  handleSubmit = () => {
    const { password, password_confirmation, errors } = this.state;
    const {
      resetPasswordParams: { email, token },
      resetPasswordAction
    } = this.props;

    if (!isValidPassword(password)) {
      this.setError(errors, 'password', true);
    } else {
      this.setError(errors, 'password', false);
    }

    if (password_confirmation !== password) {
      this.setError(errors, 'password_confirmation', true);
    } else {
      this.setError(errors, 'password_confirmation', false);
    }

    const withError = errors.find(({ val }) => val === true);
    if (typeof withError !== 'undefined') {
      return this.setState({ valid: false });
    } else {
      this.setState({ valid: true });
    }

    resetPasswordAction({ email, token, password, password_confirmation });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps === this.props) return;
    if (prevState === this.state) return;
    const { resetMessage } = this.props;
    console.log({ resetMessage });
    if (resetMessage !== null) {
      if (typeof resetMessage === 'undefined') return;
      const {
        resetMessage: { status, message }
      } = this.props;
      if (status === 'PASSWORD_UPDATED') {
        this.setState({ modalVisible: true });
      }
    }
  };

  handleModalAction = (value) => {
    this.setState({ modalVisible: value }, () => {
      this.props.clearResetPasswordParamsAction();
    });
  };

  render() {
    const { errors, valid, password, password_confirmation, modalVisible } = this.state;

    let stateError = {};

    errors.map(({ key, val }) => {
      Object.assign(stateError, { [key]: val });
    });

    return (
      <React.Fragment>
        <ContentWrap style={{ paddingTop: 30 }}>
          <Text style={{ marginBottom: 20 }}>
            You have requested to reset your password. Enter your new password below.
          </Text>
          <PasswordInput
            name="password"
            value={password}
            handleChangeText={this.handleChange}
            style={styles.textInput}
            placeholder="Enter new password"
            error={stateError.password}
          />
          <PasswordInput
            name="password_confirmation"
            value={password_confirmation}
            handleChangeText={this.handleChange}
            style={styles.textInput}
            placeholder="Confirm new password"
            error={stateError.password_confirmation}
          />
          {!valid ? <Text>There are errors in your entries. Please fix!</Text> : null}
          {this.props.error && <Text>{this.props.error}</Text>}
          <Button onPress={() => this.handleSubmit()} mode="contained">
            Reset
          </Button>
        </ContentWrap>
        <AlertModal
          variant="success"
          message="You can now use your new password to login to your account."
          showAction={this.handleModalAction}
          visible={modalVisible}
          confirmText="Login"
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  resetPasswordParams: selectResetPasswordParams,
  resetMessage: selectResetMessage,
  error: selectError,
  isFetching: selectIsFetching
});

const actions = {
  clearResetPasswordParamsAction: Creators.clearResetPasswordParams,
  resetPasswordAction: Creators.resetPassword
};

export default compose(
  withHeaderPush(),
  connect(mapStateToProps, actions),
  withLoader
)(ResetPasswordScreen);
