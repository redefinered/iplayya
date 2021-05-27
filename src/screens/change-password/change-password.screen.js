/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React from 'react';
import { Dimensions, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import MainButton from 'components/button/mainbutton.component';
import PasswordInput from 'components/password-input/password-input.component';

import withHeaderPush from 'components/with-header-push/with-header-push.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/password/password.actions';
import { createStructuredSelector } from 'reselect';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import {
  selectError,
  selectIsFetching,
  selectUpdateParams,
  selectUpdated
} from 'modules/ducks/password/password.selectors';

import { isValidPassword } from 'common/validate';

const { width, height: wHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.1)'
  }
});

class ChangePasswordScreen extends React.Component {
  state = {
    old_password: '',
    password: '',
    password_confirmation: '',
    valid: true,
    errors: [
      { key: 'first_name', val: false },
      { key: 'last_name', val: false },
      { key: 'username', val: false },
      { key: 'old_password', val: false },
      { key: 'password', val: false },
      { key: 'password_confirmation', val: false }
    ]
  };

  componentDidMount() {
    this.props.enableSwipeAction(false);
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
    const { old_password, password, password_confirmation, errors } = this.state;

    const { updatePasswordAction } = this.props;

    if (!isValidPassword(old_password)) {
      this.setError(errors, 'old_password', true);
    } else {
      this.setError(errors, 'old_password', false);
    }

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

    if (!isValidPassword(password_confirmation)) {
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

    updatePasswordAction({ password, password_confirmation });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.updated !== this.props.updated) {
      const { updated } = this.props;
      console.log({ updated });
    }
  }

  render() {
    const { errors, valid, old_password, password, password_confirmation } = this.state;

    let stateError = {};

    errors.map(({ key, val }) => {
      Object.assign(stateError, { [key]: val });
    });

    return (
      <KeyboardAvoidingView>
        <ContentWrap style={{ paddingTop: 30 }}>
          <Text
            style={{ marginBottom: 20, textAlign: 'center', paddingHorizontal: 60, fontSize: 16 }}
          >
            In order to change your password, enter your new password below.
          </Text>
          <View>
            <PasswordInput
              name="old_password"
              value={old_password}
              handleChangeText={this.handleChange}
              style={{ ...styles.textInput }}
              autoCapitalize="none"
              placeholder="Current Password"
              error={stateError.old_password}
            />
            <PasswordInput
              name="password"
              value={password}
              autoCapitalize="none"
              handleChangeText={this.handleChange}
              style={styles.textInput}
              placeholder="New password"
              error={stateError.password}
            />
            <PasswordInput
              name="password_confirmation"
              value={password_confirmation}
              autoCapitalize="none"
              handleChangeText={this.handleChange}
              style={styles.textInput}
              placeholder="Confirm new password"
              error={stateError.password_confirmation}
            />
          </View>
          {!valid ? <Text>There are errors in your entries. Please fix!</Text> : null}
          {this.props.error && <Text>{this.props.error}</Text>}
          <MainButton onPress={() => this.handleSubmit()} text="Change" style={{ marginTop: 30 }} />
        </ContentWrap>
      </KeyboardAvoidingView>
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
  updatePasswordAction: Creators.update,
  enableSwipeAction: NavActionCreators.enableSwipe
};

const enhance = compose(connect(mapStateToProps, actions), withHeaderPush({ withLoader: true }));

export default enhance(ChangePasswordScreen);
