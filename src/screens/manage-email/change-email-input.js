/* eslint-disable react/prop-types */

import React from 'react';
import { View, Pressable, TextInput as FormInput } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import MainButton from 'components/button/main-button.component';

// import withLoader from 'components/with-loader.component';
import withFormWrap from 'components/with-form-wrap/with-form-wrap.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/profile/profile.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectProfile,
  selectUpdated,
  selectAuthenticatedEmailChange
} from 'modules/ducks/profile/profile.selectors';

import { isValidPassword } from 'common/validate';
import theme from 'common/theme';

class ChangeEmailInput extends React.Component {
  constructor(props) {
    super(props);

    const { email } = props.profile;
    this.state = {
      showPassword: false,
      valid: true,
      email,
      password: '',
      errors: {
        password: null
      }
    };
  }

  componentDidMount() {
    this.props.getProfileAction();
  }

  handleChange = (value) => {
    this.setState({ password: value });
  };

  setError = (field, val) => {
    // const index = stateError.findIndex(({ key }) => key === field);
    // stateError[index].val = val;
    this.setState({ errors: Object.assign(this.state.errors, { [field]: val }) });
  };

  handleSubmit = () => {
    const { authenticateEmailChangeAction, startAction } = this.props;
    // eslint-disable-next-line no-unused-vars
    const { errors: stateError, email, valid, showPassword, password } = this.state;
    startAction();

    if (password === '') {
      this.setError('password', 'Password is required');
      return;
    } else {
      if (!isValidPassword(password)) {
        this.setError('password', 'Your password is incorrect');
      } else {
        this.setError('password', null);
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

    // console.log('no error go next');
    authenticateEmailChangeAction({ username: email, password });
  };

  componentDidUpdate(prevProps) {
    if (this.props.authenticatedEmailChange !== prevProps.authenticatedEmailChange) {
      const {
        updateAction,
        profile: { id },
        newEmail
      } = this.props;
      updateAction({ id, email: newEmail });
    }

    if (prevProps.updated !== this.props.updated) {
      const { navigation } = this.props;
      this.props.handleModalClose(false);
      navigation.navigate('ManageEmailScreen');
    }

    if (prevProps !== this.props.error) {
      const { error } = this.props;
      if (error === 'Error: Internal server error') {
        this.props.handleModalClose(false);
      }
    }
  }

  render() {
    const { showPassword, errors, password } = this.state;

    // let stateError = {};

    // errors.map(({ key, val }) => {
    //   Object.assign(stateError, { [key]: val });
    // });

    return (
      <View style={{ paddingHorizontal: 25, paddingBottom: 10 }}>
        <View style={{ position: 'relative' }}>
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
            error={errors.password || this.props.error}
            autoCapitalize="none"
            selectionColor={'#E34398'}
            secureTextEntry={!showPassword}
            onChangeText={(value) => this.handleChange(value, password)}
            placeholder="Enter Password"
            placeholderTextColor="#000000"
            style={{
              marginBottom: 10,
              backgroundColor: 'rgba(13, 17, 29, 0.1)',
              borderRadius: 8
            }}
            theme={{
              colors: {
                primary: 'rgba(255,255,255,0.1)',
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
              size={showPassword ? theme.iconSize(3) : theme.iconSize(5)}
              style={{ color: 'rgba(0,0,0,0.8)' }}
            />
          </Pressable>
        </View>
        <View style={{ paddingBottom: 10, justifyContent: 'center' }}>
          {errors.password && <Text style={{ color: '#000000' }}>{errors.password}</Text>}
          {/* {!valid ? (
            <Text style={{ color: '#000000' }}>There are errors in your entries. Please fix!</Text>
          ) : null} */}
          {this.props.error && <Text style={{ color: '#000000' }}>Your password is Incorrect</Text>}
        </View>
        <View>
          <MainButton text="Proceed" onPress={() => this.handleSubmit()} />
        </View>
      </View>
    );
  }
}

const actions = {
  getProfileAction: Creators.get,
  updateAction: Creators.update,
  authenticateEmailChangeAction: Creators.authenticateEmailChange,
  startAction: Creators.start
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  profile: selectProfile,
  updated: selectUpdated,
  authenticatedEmailChange: selectAuthenticatedEmailChange
});

const enhance = compose(connect(mapStateToProps, actions), withFormWrap);

export default enhance(ChangeEmailInput);
