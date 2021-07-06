/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */

import React from 'react';
// import PropTypes from 'prop-types';
import ContentWrap from 'components/content-wrap.component';
import ScreenContainer from 'components/screen-container.component';
import MainButton from 'components/button/mainbutton.component';
import TextInput from 'components/text-input/text-input.component';
// import PasswordInput from 'components/password-input/password-input.component';
import { View, Modal, Dimensions } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';

import withLoader from 'components/with-loader.component';
import withFormWrap from 'components/with-form-wrap/with-form-wrap.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/profile/profile.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectProfile,
  selectUpdated
} from 'modules/ducks/profile/profile.selectors';

// import Icon from 'components/icon/icon.component';

import { isValidEmail } from 'common/validate';
import ChangeEmailInput from './change-email-input';

class ChangeEmailScreen extends React.Component {
  constructor(props) {
    super(props);

    const { email } = props.profile;

    this.state = {
      modalVisible: false,
      valid: true,
      email,
      showPassword: false,
      errors: [
        { key: 'email', val: false },
        { key: 'password', val: false }
      ]
    };
  }

  componentDidMount() {
    this.props.getProfileAction();
  }

  handleChangeText = (text, name) => {
    this.setState({ [name]: text });
  };

  setError = (stateError, field, val) => {
    const index = stateError.findIndex(({ key }) => key === field);
    stateError[index].val = val;
    this.setState({ errors: stateError });
  };

  handleSubmit = () => {
    const { email, errors } = this.state;

    if (!isValidEmail(email)) {
      this.setError(errors, 'email', true);
    } else {
      this.setError(errors, 'email', false);
    }

    const withError = errors.find(({ val }) => val === true);
    if (typeof withError !== 'undefined') {
      return this.setState({ valid: false });
    } else {
      this.setState({ valid: true });
    }

    console.log('no errors! submit.');
    if (email === false) {
      return this.setState({ modalVisible: false });
    } else {
      this.setState({ modalVisible: true });
    }
  };

  handleClose = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const { errors, valid, modalVisible, ...form } = this.state;

    let stateError = {};

    errors.map(({ key, val }) => {
      Object.assign(stateError, { [key]: val });
    });

    return (
      <ContentWrap style={{ paddingTop: 30 }}>
        <Modal
          animationType="slide"
          visible={modalVisible}
          transparent={true}
          statusBarTranslucent={true}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)'
            }}
          >
            <View
              style={{
                backgroundColor: '#ffffff',
                width: Dimensions.get('window').width - 20,
                height: Dimensions.get('window').height - 0.25 * Dimensions.get('window').height,
                borderRadius: 30
              }}
            >
              <View style={{ paddingHorizontal: 25, paddingVertical: 10 }}>
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'left',
                    color: 'rgba(0, 0, 0, 0.7)',
                    fontWeight: '700'
                  }}
                >
                  Enter your password below to continue changing your email.
                </Text>
              </View>
              {/* <View style={{ paddingHorizontal: 25, paddingBottom: 10 }}>
                <View style={{ position: 'relative' }}>
                  <PasswordInput
                    render={(props) => (
                      <FormInput
                        {...props}
                        style={{
                          color: '#000000',
                          backgroundColor: 'rgba(13, 17, 29, 0.1)',
                          padding: 14,
                          borderWidth: 0
                        }}
                      />
                    )}
                    name="password"
                    handleChangeText={this.handleChangeText}
                    value={form.password}
                    autoCapitalize="none"
                    error={stateError.password}
                    theme={{ colors: { primary: 'transparent', underlineColor: 'transparent' } }}
                    style={{
                      position: 'relative',
                      zIndex: 1
                    }}
                    placeholder="Enter Password"
                    placeholderTextColor="#000000"
                    secureTextEntry={!showPassword}
                  />
                  <Pressable
                    onPress={() => this.setState({ showPassword: !showPassword })}
                    style={{
                      position: 'absolute',
                      right: 10,
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 40,
                      zIndex: 2
                    }}
                  >
                    <Icon
                      name={showPassword ? 'close' : 'eye'}
                      size={showPassword ? 25 : 40}
                      style={{ color: 'rgba(0,0,0,0.8)' }}
                    />
                  </Pressable>
                </View>
              </View>
              {!valid ? (
                <Text style={{ color: '#000000', textAlign: 'center' }}>
                  There are errors in your entries. Please fix!
                </Text>
              ) : null}
              {this.props.error && <Text>{this.props.error}</Text>}
              <View style={{ paddingHorizontal: 25, paddingBottom: 25 }}>
                <MainButton text="Proceed" onPress={() => this.handleChange()} />
              </View> */}
              <View style={{ height: 150 }}>
                <ChangeEmailInput />
              </View>
              <TouchableRipple
                style={{ paddingVertical: 10 }}
                rippleColor="rgba(0,0,0,0.05)"
                onPress={() => this.handleClose()}
              >
                <Text
                  style={{
                    fontSize: 14,
                    textAlign: 'center',
                    color: '#000000',
                    fontWeight: 'bold'
                  }}
                >
                  Cancel
                </Text>
              </TouchableRipple>
            </View>
          </View>
        </Modal>
        <Text
          style={{ marginBottom: 20, textAlign: 'center', paddingHorizontal: 40, fontSize: 16 }}
        >
          You can change your email by typing in your new email below
        </Text>
        <View>
          <TextInput
            name="email"
            value={form.email}
            handleChangeText={this.handleChangeText}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            keyboardType="email-address"
            autoCompleteType="email"
            error={stateError.email}
            style={{ paddingBottom: 20 }}
          />
          {!valid ? <Text>There are errors in your entries. Please fix!</Text> : null}
          {this.props.error && <Text>{this.props.error}</Text>}
          <MainButton text="Submit" onPress={() => this.handleSubmit()} />
        </View>
      </ContentWrap>
    );
  }
}

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ChangeEmailScreen {...props} />
  </ScreenContainer>
);

const actions = {
  getProfileAction: Creators.get,
  updateStartAction: Creators.updateStart,
  updateAction: Creators.update
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  profile: selectProfile,
  updated: selectUpdated
});

const enhance = compose(connect(mapStateToProps, actions), withFormWrap, withLoader);

export default enhance(Container);
