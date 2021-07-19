/* eslint-disable react/prop-types */

import React from 'react';
import { View, StatusBar } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
import PasswordInput from 'components/password-input/password-input.component';
// import Button from 'components/button/button.component';
import MainButton from 'components/button/mainbutton.component';
import AlertModal from 'components/alert-modal/alert-modal.component';

import ScreenContainer from 'components/screen-container.component';
import withFormWrap from 'components/with-form-wrap/with-form-wrap.component';
import withLoader from 'components/with-loader.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/profile/profile.actions';
// import { Creators as UserCreators } from 'modules/ducks/user/user.actions';
import { Creators as ProviderCreators } from 'modules/ducks/provider/provider.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectProviders,
  selectCreated
} from 'modules/ducks/provider/provider.selectors';
import { selectCurrentUserId } from 'modules/ducks/auth/auth.selectors';
import { selectOnboardinginfo } from 'modules/ducks/profile/profile.selectors';
import clone from 'lodash/clone';

import styles from './add-iptv.styles';

// eslint-disable-next-line no-unused-vars
import { isValidUsername, isValidWebsite } from 'common/validate';
import { selectIsProviderSetupSkipped } from 'modules/ducks/provider/provider.selectors';
class AddIptvScreen extends React.Component {
  state = {
    modalVisible: false,
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

  static defaultProps = {
    route: { params: { previousScreen: 'IPTV' } }
  };

  componentDidMount() {
    // resets provider create state
    this.props.createStartAction();
    this.props.enableSwipeAction(false);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.created !== this.props.created) {
      const { created, navigation, route } = this.props;
      if (created) {
        const { params } = route;

        /// if nextScreen param is not defined go back
        // because that means the previous screen is the main IPTV screen
        if (typeof params === 'undefined') return navigation.goBack();

        if (params.nextScreen === 'home') {
          /// go to home-stack
          // return navigation.navigate('HomeScreen'); /// FOR TESTING
          /// home stack should be rendered
          // like magic
        }

        // if nextScreen is iptv
        return navigation.goBack();
      }
    }
    if (prevProps.error === this.props.error) return;
    if (this.props.error) {
      this.setState({ modalVisible: true });
    } else {
      this.setState({ modalVisible: false });
    }
  }

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
    const { modalVisible, errors: stateError, valid, ...input } = this.state;

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
    // const { skippedProviderAdd } = this.props;
    const { errors, modalVisible, ...input } = this.state; // remove valid

    // const [modalVisible, setModalVisible] = React.useState(false);

    // let stateError = {};

    // errors.map(({ key, val }) => {
    //   Object.assign(stateError, { [key]: val });
    // });

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

        <View style={{ flex: 10 }}>
          {!this.props.isProviderSetupSkipped ? (
            <TouchableRipple
              rippleColor="rgba(0,0,0,0.28)"
              style={styles.skip}
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
  providers: selectProviders,
  // skippedProviderAdd: selectSkippedProviderAdd,
  userId: selectCurrentUserId,
  onboardinginfo: selectOnboardinginfo,
  isProviderSetupSkipped: selectIsProviderSetupSkipped
});

const actions = {
  createStartAction: ProviderCreators.createStart,
  createAction: ProviderCreators.create,
  // skipProviderAddAction: UserCreators.skipProviderAdd,
  enableSwipeAction: NavActionCreators.enableSwipe,
  updateProfileAction: Creators.update
};

const enhance = compose(connect(mapStateToProps, actions), withLoader, withFormWrap);

export default enhance(Container);
