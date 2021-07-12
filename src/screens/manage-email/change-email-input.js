/* eslint-disable react/prop-types */

import React from 'react';
import { View, Pressable, TextInput as FormInput } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import MainButton from 'components/button/mainbutton.component';

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

import { isValidPassword } from 'common/validate';

class ChangeEmailInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPassword: false,
      valid: true,
      errors: [{ key: 'password', val: false }]
    };
  }

  handleChangeText = (text, name) => {
    this.setState({ [name]: text });
  };

  setError = (stateError, field, val) => {
    const index = stateError.findIndex(({ key }) => key === field);
    stateError[index].val = val;
    this.setState({ errors: stateError });
  };

  handleChange = () => {
    const { password, errors } = this.state;

    if (!isValidPassword(password)) {
      this.setError(errors, 'password', true);
    } else {
      this.setError(errors, 'password', false);
    }

    const withError = errors.find(({ val }) => val === true);
    if (typeof withError !== 'undefined') {
      return this.setState({ valid: false });
    } else {
      this.setState({ valid: true });
    }

    console.log('no error go next');
  };

  render() {
    const { showPassword, errors, valid, password } = this.state;

    let stateError = {};

    errors.map(({ key, val }) => {
      Object.assign(stateError, { [key]: val });
    });

    return (
      <View style={{ paddingHorizontal: 25, paddingBottom: 10 }}>
        <View style={{ position: 'relative', paddingBottom: 10 }}>
          <TextInput
            render={(props) => (
              <FormInput
                {...props}
                style={{
                  color: '#000000',
                  padding: 12,
                  fontSize: 16,
                  justifyContent: 'center'
                }}
              />
            )}
            mode="outlined"
            name="password"
            value={password}
            error={stateError.password}
            autoCapitalize="none"
            selectionColor={'#E34398'}
            secureTextEntry={!showPassword}
            onChangeText={this.handleChangeText}
            placeholder="Enter Password"
            placeholderTextColor="#000000"
            style={{
              marginBottom: 10,
              backgroundColor: 'rgba(13, 17, 29, 0.1)',
              borderRadius: 8
            }}
            theme={{
              colors: {
                primary: 'transparent',
                error: '#E34398',
                placeholder: 'transparent'
              },
              fonts: { regular: { fontFamily: 'sans-serif' } },
              roundness: 10
            }}
            ref={(ref) => ref && ref.setNativeProps({ style: { fontFamily: 'sans-serif' } })}
          />
          <Pressable
            onPress={() => this.setState({ showPassword: !showPassword })}
            style={{
              position: 'absolute',
              right: 10,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
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
        {!valid ? (
          <Text style={{ color: '#000000' }}>There are errors in your entries. Please fix!</Text>
        ) : null}
        {this.props.error && <Text>{this.props.error}</Text>}
        <View>
          <MainButton text="Proceed" onPress={() => this.handleChange()} />
        </View>
      </View>
    );
  }
}

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

export default enhance(ChangeEmailInput);
