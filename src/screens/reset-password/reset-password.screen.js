/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import Button from 'components/button/button.component';
import MainButton from 'components/button/mainbutton.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import PasswordInput from 'components/password-input/password-input.component';
import ScreenContainer from 'components/screen-container.component';
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
    errorMessage: '',
    errors: {
      password: null,
      password_confirmation: null,
      commonError: null,
      password_validation: null
      // { key: 'first_name', val: false },
      // { key: 'last_name', val: false },
      // { key: 'username', val: false },
      // { key: 'email', val: false },
      // { key: 'password', val: false },
      // { key: 'password_confirmation', val: false }
    }
  };

  handleChange = (value, name) => {
    this.setState({ [name]: value });
    if (isValidPassword(value)) {
      this.setError('password', null);
      this.setError('commonError', null);
    }
  };

  handleOnFocus = () => {
    if (!isValidPassword(this.state.password)) {
      this.setError(
        'password_validation',
        '• At least 4 characters long. \n• Should contain upper case letters and numbers'
      );
    } else {
      this.setError('password_validation', null);
      this.setError('commonError', null);
    }
    if (this.state.password_confirmation === '') {
      this.setError('password_confirmation', null);
      this.setError('password', null);
    }
  };

  // stateError,
  setError = (field, val) => {
    // const index = stateError.findIndex(({ key }) => key === field);
    // stateError[index].val = val;
    this.setState({ errors: Object.assign(this.state.errors, { [field]: val }) });
  };

  handleSubmit = () => {
    const { errors: stateError, valid, password, password_confirmation } = this.state;

    const {
      updateParams: { email, token },
      updatePasswordAction
    } = this.props;

    if (!isValidPassword(password)) {
      this.setError(
        'password',
        '• At least 4 characters long. \n• Should contain upper case letters and numbers'
      );
      this.setError('password_validation', null);
    } else {
      this.setError('password', null);
      this.setError('password_validation', null);
    }

    if (password === '' && password_confirmation === '') {
      this.setError('password_confirmation', 'Please fill required field');
      this.setError('commonError', ' ');
      this.setError('password_validation', null);
      this.setError('password', null);
    } else {
      if (password_confirmation !== password) {
        this.setError('commonError', ' ');
        this.setError('password_confirmation', 'Password does not Match');
      } else {
        this.setError('commonError', null);
        this.setError('password_confirmation', null);
      }
    }

    const withError = Object.keys(stateError)
      .map((key) => ({ key, val: stateError[key] }))
      .find(({ val }) => val !== null);

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
      if (updated) {
        this.setState({ modalVisible: true });
      }
    }
  }

  handleModalConfirm = () => {
    this.setState({ modalVisible: false }, () => {
      this.props.resetUpdateParamsAction();
      this.props.passwordResetStartAction();
    });
  };

  render() {
    const { errors, valid, password, password_confirmation, modalVisible } = this.state;

    // let stateError = {};

    // errors.map(({ key, val }) => {
    //   Object.assign(stateError, { [key]: val });
    // });

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
            focusAction={this.handleOnFocus}
            placeholder="Enter new password"
            error={errors.password || errors.commonError}
          />
          {errors.password_validation ? <Text>{errors.password_validation}</Text> : null}
          {errors.password ? <Text>{errors.password}</Text> : null}
          <PasswordInput
            name="password_confirmation"
            value={password_confirmation}
            handleChangeText={this.handleChange}
            focusAction={this.handleOnFocus}
            style={styles.textInput}
            placeholder="Confirm new password"
            error={errors.password_confirmation}
          />
          {errors.password_confirmation ? <Text>{errors.password_confirmation}</Text> : null}
          {errors.commonError ? <Text>{errors.commonError}</Text> : null}
          {/* {!valid ? <Text>{this.state.errorMessage}</Text> : null} */}
          {this.props.error && <Text>{this.props.error}</Text>}
          <MainButton
            onPress={() => this.handleSubmit()}
            text="Reset"
            style={{ marginTop: 10, borderRadius: 8 }}
          />

          {this.props.updated === false ? (
            <Button onPress={() => this.props.resetUpdateParamsAction()}>Start over</Button>
          ) : null}
        </ContentWrap>

        <AlertModal
          variant="success"
          message="You can now use your new password to login to your account."
          confirmText="Login"
          confirmAction={this.handleModalConfirm}
          hideAction={this.handleModalConfirm}
          visible={modalVisible}
        />
      </React.Fragment>
    );
  }
}

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ResetPasswordScreen {...props} />
  </ScreenContainer>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  updateParams: selectUpdateParams,
  updated: selectUpdated
});

const actions = {
  // clearResetPasswordParamsAction: Creators.clearResetPasswordParams,
  resetUpdateParamsAction: Creators.resetUpdateParams,
  passwordResetStartAction: Creators.start,
  updatePasswordAction: Creators.update
};

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
