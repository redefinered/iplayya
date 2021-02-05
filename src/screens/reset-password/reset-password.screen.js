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
import { Creators } from 'modules/ducks/password/password.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectUpdateParams,
  selectUpdated
} from 'modules/ducks/password/password.selectors';

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
      updateParams: { email, token },
      updatePasswordAction
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

    updatePasswordAction({ email, token, password, password_confirmation });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.updated !== this.props.updated) {
      const { updated } = this.props;
      console.log({ updated });
      if (updated) {
        this.setState({ modalVisible: true });
      }
    }
  }

  handleModalConfirm = () => {
    this.setState({ modalVisible: false }, () => {
      this.props.resetUpdateParamsAction();
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
          {this.props.updated === false ? (
            <Button onPress={() => this.props.resetUpdateParamsAction()}>Start over</Button>
          ) : null}
        </ContentWrap>

        <AlertModal
          variant="success"
          message="You can now use your new password to login to your account."
          confirmText="Login"
          confirmAction={this.handleModalConfirm}
          visible={modalVisible}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  updateParams: selectUpdateParams,
  updated: selectUpdated
});

const actions = {
  // clearResetPasswordParamsAction: Creators.clearResetPasswordParams,
  resetUpdateParamsAction: Creators.resetUpdateParams,
  updatePasswordAction: Creators.update
};

export default compose(
  withHeaderPush(),
  connect(mapStateToProps, actions),
  withLoader
)(ResetPasswordScreen);
