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

    // const { email } = props.profile;
    this.state = {
      modalVisible: false,
      valid: true,
      email: '',
      errors: {
        email: null
      }
    };
  }

  componentDidMount() {
    this.props.getProfileAction();
  }

  handleChangeText = (text, name) => {
    if (name === 'email') {
      if (text === '') {
        this.setError('email', null);
      }
      return this.setState({ [name]: text.toLowerCase().trim() });
    }
    this.setState({ [name]: text });
  };

  handleOnFocus = () => {
    if (!isValidEmail(this.state.email)) {
      this.setError('email', 'Invalid email address');
    } else {
      this.setError('email', null);
    }
    if (this.state.email === '') {
      this.setError('email', null);
    }
  };

  setError = (field, val) => {
    // const index = stateError.findIndex(({ key }) => key === field);
    // stateError[index].val = val;
    this.setState({ errors: Object.assign(this.state.errors, { [field]: val }) });
  };

  handleSubmit = () => {
    // eslint-disable-next-line no-unused-vars
    const { modalVisible, valid, errors: stateError, loading, ...form } = this.state;

    if (!form.email.length) {
      this.setError('email', 'Email is required');
    } else {
      if (!isValidEmail(form.email)) {
        this.setError('email', 'Invalid email address.');
      } else {
        this.setError('email', null);
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

    console.log('no errors! submit.');
    if (form.email === false) {
      return this.setState({ modalVisible: false });
    } else {
      this.setState({ modalVisible: true });
    }
  };

  handleClose = () => {
    this.setState({ modalVisible: false });
    this.props.getProfileAction();
  };

  handleModalClose = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const { email } = this.props.profile;
    const { errors, modalVisible, ...form } = this.state;

    // let stateError = {};
    // errors.map(({ key, val }) => {
    //   Object.assign(stateError, { [key]: val });
    // });

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
              <View style={{ height: 150 }}>
                <ChangeEmailInput
                  newEmail={form.email}
                  navigation={this.props.navigation}
                  handleModalClose={this.handleModalClose}
                />
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
          style={{
            marginBottom: 20,
            textAlign: 'left',
            fontSize: 16
          }}
        >
          You can change your email by typing in your new email below.
        </Text>
        <View>
          <TextInput
            name="email"
            value={form.email}
            focusAction={this.handleOnFocus}
            handleChangeText={this.handleChangeText}
            autoCapitalize="none"
            clearButtonMode="while-editing"
            keyboardType="email-address"
            autoCompleteType="email"
            placeholder={email}
            error={errors.email || this.props.error}
          />

          <View style={{ paddingBottom: 20, justifyContent: 'center' }}>
            {errors.email && <Text>{errors.email}</Text>}
            {/* {!valid ? <Text>There are errors in your entries. Please fix!</Text> : null} */}
            {this.props.error && <Text>The email has already been taken.</Text>}
          </View>

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
