/* eslint-disable react/prop-types */

import React from 'react';
import { View, StatusBar } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
import PasswordInput from 'components/password-input/password-input.component';
import SnackBar from 'components/snackbar/snackbar.component';
// import Button from 'components/button/button.component';
import MainButton from 'components/button/mainbutton.component';
import AlertModal from 'components/alert-modal/alert-modal.component';

import ScreenContainer from 'components/screen-container.component';
import withFormWrap from 'components/with-form-wrap/with-form-wrap.component';
import withLoader from 'components/with-loader.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/profile/profile.actions';
import { Creators as ProviderCreators } from 'modules/ducks/provider/provider.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators as ProfileCreators } from 'modules/ducks/profile/profile.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectProviders,
  selectCreated,
  selectUpdated
} from 'modules/ducks/provider/provider.selectors';
import { selectIsInitialSignIn, selectCurrentUserId } from 'modules/ducks/auth/auth.selectors';
import { selectOnboardinginfo } from 'modules/ducks/profile/profile.selectors';
import styles from './add-iptv.styles';
import clone from 'lodash/clone';

// eslint-disable-next-line no-unused-vars
import { isValidUsername, isValidWebsite } from 'common/validate';
// import { selectIsProviderSetupSkipped } from 'modules/ducks/provider/provider.selectors';
// import { profileState } from 'modules/ducks/profile/profile.selectors';
// import {  } from 'modules/ducks/auth/auth.selectors';
class AddIptvScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      showSuccessMessage: false,
      name: '',
      portal_address: '',
      username: '',
      password: '',
      valid: true,
      errors: {
        name: null,
        portal_address: null,
        username: null,
        password: null,
        commonError: null
      }
    };
  }

  componentDidMount() {
    // resets provider create state
    this.props.createStartAction();
    this.props.enableSwipeAction(false);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showSuccessMessage !== prevState.showSuccessMessage) {
      if (!this.state.showSuccessMessage) {
        if (typeof this.props.route.params === 'undefined') {
          this.props.navigation.goBack();
        }
      }
    }

    if (prevProps.created !== this.props.created) {
      const { created } = this.props;
      console.log({ created }); // returns true
      if (created) {
        this.setState({ showSuccessMessage: true }, () => this.handleUpdateSuccess());
      }
    }

    /// handle error
    if (prevProps.error !== this.props.error) {
      if (this.props.error) {
        this.setState({ modalVisible: true });
      } else {
        this.setState({ modalVisible: false });
      }
    }
  }

  handleUpdateSuccess = () => {
    this.hideSnackBar();
  };

  hideSnackBar = () => {
    this.props.getProfileAction();
    setTimeout(() => {
      this.setState({ showSuccessMessage: false });
    }, 3000);
  };

  handleSkip = () => {
    const { userId, onboardinginfo, updateProfileAction } = this.props;

    const clonedOnboardinginfo = clone(onboardinginfo);

    updateProfileAction({
      id: userId,
      onboardinginfo: JSON.stringify(
        Object.assign(clonedOnboardinginfo, { skippedProviderSetup: true })
      )
    });
  };

  handleChange = (value, name) => {
    this.setState({ [name]: value });
    if (name === 'name') {
      if (value === '') {
        this.setError('name', null);
      }
    }
  };

  handleOnFocus = () => {
    if (this.state.name.length < 4) {
      this.setError('name', 'At least 4 characters length.');
    } else {
      this.setError('name', null);
    }
    if (this.state.name === '') {
      this.setError('name', null);
      this.setError('commonError', null);
    }
  };

  setError = (field, val) => {
    this.setState({ errors: Object.assign(this.state.errors, { [field]: val }) });
  };

  // setError = (stateError, field, val) => {
  //   const index = stateError.findIndex(({ key }) => key === field);
  //   stateError[index].val = val;
  //   this.setState({ errors: stateError });
  // };

  handleSubmit = () => {
    // eslint-disable-next-line no-unused-vars
    const { modalVisible, errors: stateError, valid, showSuccessMessage, ...input } = this.state;

    // console.log({ input, stateError });

    // validation here
    // if (!input.name || input.name.length < 5) {
    //   this.setError(stateError, 'name', true);
    // } else {
    //   this.setError(stateError, 'name', false);
    // }

    if (
      input.name === '' &&
      input.portal_address === '' &&
      input.username === '' &&
      input.password === ''
    ) {
      this.setError('commonError', 'Please fill the required fields.');
      return;
    } else {
      this.setError('commonError', null);
    }

    if (!input.name.length) {
      this.setError('name', 'IPTV provider name is required');
    } else {
      this.setError('name', null);
    }

    // if (!input.portal_address) {
    //   this.setError(stateError, 'portal_address', true);
    // } else {
    //   if (!isValidWebsite(input.portal_address)) {
    //     this.setError(stateError, 'portal_address', true);
    //   } else {
    //     this.setError(stateError, 'portal_address', false);
    //   }
    // }

    if (!input.portal_address.length) {
      this.setError('portal_address', 'Portal address is required');
    } else {
      if (!isValidWebsite(input.portal_address)) {
        this.setError('portal_address', 'Invalid portal address');
      } else {
        this.setError('portal_address', null);
      }
    }

    // if (!isValidUsername(input.username)) {
    //   this.setError(stateError, 'username', true);
    // } else {
    //   this.setError(stateError, 'username', false);
    // }

    if (!input.username.length) {
      this.setError('username', 'Username is required');
    } else {
      if (!isValidUsername(input.username)) {
        this.setError('username', 'Invalid username');
      } else {
        this.setError('username', null);
      }
    }

    /// TODO: fix password validation -- Deluge@2020! is invalid
    // if (!isValidPassword(input.password)) {
    // if (!input.password) {
    //   this.setError(stateError, 'password', true);
    // } else {
    //   this.setError(stateError, 'password', false);
    // }

    if (!input.password.length) {
      this.setError('password', 'Password is required');
    } else {
      this.setError('password', null);
    }

    const withError = Object.keys(stateError)
      .map((key) => ({ key, val: stateError[key] }))
      .find(({ val }) => val !== null);

    if (typeof withError !== 'undefined') {
      return this.setState({ valid: false });
    } else {
      this.setState({ valid: true });
    }

    // const withError = stateError.find(({ val }) => val === true);
    // if (typeof withError !== 'undefined') {
    //   return this.setState({ valid: false });
    // } else {
    //   this.setState({ valid: true });
    // }

    // submit if no errors
    this.props.createAction({ input });
  };

  handleComfirmAction = () => {
    this.props.createStartAction();
    this.setState({ modalVisible: false });
  };

  render() {
    const { errors, modalVisible, showSuccessMessage, ...input } = this.state;

    return (
      <React.Fragment>
        <ContentWrap scrollable style={{ paddingTop: 40 }}>
          <StatusBar translucent backgroundColor="transparent" />
          <TextInput
            value={input.name.trimStart().replace(/\s\s+/g, ' ')}
            name="name"
            style={styles.textInput}
            placeholder="IPTV provider name"
            handleChangeText={this.handleChange}
            error={errors.name || errors.commonError}
            maxLength={30}
            focusAction={this.handleOnFocus}
            clearButtonMode="while-editing"
            autoCapitalize="words"
          />
          {errors.name ? <Text style={{ marginBottom: 5 }}>{errors.name}</Text> : null}
          <TextInput
            value={input.portal_address}
            name="portal_address"
            style={styles.textInput}
            placeholder="Portal address"
            focusAction={this.handleOnFocus}
            handleChangeText={this.handleChange}
            error={errors.portal_address || errors.commonError}
            keyboardType="url"
            clearButtonMode="while-editing"
            autoCapitalize="none"
          />
          {errors.portal_address ? (
            <Text style={{ marginBottom: 5 }}>{errors.portal_address}</Text>
          ) : null}
          <TextInput
            value={input.username}
            name="username"
            style={styles.textInput}
            placeholder="Username"
            focusAction={this.handleOnFocus}
            handleChangeText={this.handleChange}
            error={errors.username || errors.commonError}
            clearButtonMode="while-editing"
            autoCapitalize="none"
          />
          {errors.username ? <Text style={{ marginBottom: 5 }}>{errors.username}</Text> : null}
          <PasswordInput
            value={input.password}
            name="password"
            style={styles.textInput}
            focusAction={this.handleOnFocus}
            handleChangeText={this.handleChange}
            error={errors.password || errors.commonError}
          />
          {errors.password ? <Text>{errors.password}</Text> : null}
          {errors.commonError ? <Text>{errors.commonError}</Text> : null}
          {/* {!valid ? <Text>Please fill the required fields.</Text> : null} */}
          {/* {this.props.error && <Text>{this.props.error}</Text>} */}
          <MainButton
            onPress={() => this.handleSubmit()}
            text="Add IPTV"
            style={{ ...styles.submit, marginTop: 25 }}
          />
        </ContentWrap>

        <View style={{ flex: 10, alignItems: 'center' }}>
          {this.props.isInitialSignIn ? (
            <TouchableRipple
              rippleColor="rgba(0,0,0,0.28)"
              style={{ width: '25%', ...styles.skip }}
              onPress={() => this.handleSkip()}
            >
              <Text>Skip for now</Text>
            </TouchableRipple>
          ) : null}
        </View>

        <AlertModal
          variant="danger"
          message="Oops! Your credentials is not valid. Call your IPTV provider for assistance."
          hideAction={() => this.handleComfirmAction()}
          confirmAction={() => this.handleComfirmAction()}
          visible={modalVisible}
        />
        <SnackBar
          visible={showSuccessMessage}
          iconName="circular-check"
          iconColor="#13BD38"
          message="Changes saved successfully"
        />
      </React.Fragment>
    );
  }
}

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <AddIptvScreen {...props} />
  </ScreenContainer>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  created: selectCreated,
  updated: selectUpdated,
  providers: selectProviders,
  // skippedProviderAdd: selectSkippedProviderAdd,
  userId: selectCurrentUserId,
  onboardinginfo: selectOnboardinginfo,
  isInitialSignIn: selectIsInitialSignIn
  // isProviderSetupSkipped: selectIsProviderSetupSkipped
});

const actions = {
  createStartAction: ProviderCreators.createStart,
  createAction: ProviderCreators.create,
  // skipProviderAddAction: UserCreators.skipProviderAdd,
  getProfileAction: ProfileCreators.get,
  enableSwipeAction: NavActionCreators.enableSwipe,
  updateProfileAction: Creators.update
};

const enhance = compose(connect(mapStateToProps, actions), withLoader, withFormWrap);

export default enhance(Container);
