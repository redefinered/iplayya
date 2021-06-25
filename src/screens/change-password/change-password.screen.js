/* eslint-disable react/prop-types */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import MainButton from 'components/button/mainbutton.component';
import PasswordInput from 'components/password-input/password-input.component';
import ScreenContainer from 'components/screen-container.component';
import withLoader from 'components/with-loader.component';
import withFormWrap from 'components/with-form-wrap/with-form-wrap.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/password/password.actions';
import { createStructuredSelector } from 'reselect';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import {
  selectError,
  selectIsFetching,
  selectUpdated
} from 'modules/ducks/password/password.selectors';

import { isValidPassword } from 'common/validate';

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.1)'
  }
});

class ChangePasswordScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      old_password: '',
      password: '',
      password_confirmation: '',
      valid: true,
      errors: [
        { key: 'first_name', val: false },
        { key: 'last_name', val: false },
        { key: 'username', val: false },
        { key: 'email', val: false },
        { key: 'old_password', val: false },
        { key: 'password', val: false },
        { key: 'password_confirmation', val: false }
      ]
    };
  }

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

    this.props.changePasswordAction({ old_password, password, password_confirmation });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.updated !== this.props.updated) {
      const { updated, navigation } = this.props;
      // console.log('www', updated);
      if (updated) {
        navigation.goBack();
      }
    }
  }

  render() {
    const { errors, valid, old_password, password, password_confirmation } = this.state;

    let stateError = {};

    errors.map(({ key, val }) => {
      Object.assign(stateError, { [key]: val });
    });

    return (
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
    );
  }
}

const container = (props) => (
  <ScreenContainer withHeaderPush>
    <ChangePasswordScreen {...props} />
  </ScreenContainer>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  updated: selectUpdated
});

const actions = {
  // clearResetPasswordParamsAction: Creators.clearResetPasswordParams,
  resetUpdateParamsAction: Creators.resetUpdateParams,
  updatePasswordAction: Creators.update,
  changePasswordAction: Creators.changePassword,
  enableSwipeAction: NavActionCreators.enableSwipe
};

const enhance = compose(connect(mapStateToProps, actions), withFormWrap, withLoader);

export default enhance(container);
