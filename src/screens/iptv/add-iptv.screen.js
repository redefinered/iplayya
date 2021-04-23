/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */

import React from 'react';
import { Pressable, View, ScrollView, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
import PasswordInput from 'components/password-input/password-input.component';
import Button from 'components/button/button.component';
import AlertModal from 'components/alert-modal/alert-modal.component';

import withFormWrap from 'components/with-form-wrap/with-form-wrap.component';
// import withLoader from 'components/with-loader.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators as UserCreators } from 'modules/ducks/user/user.actions';
import { Creators as ProviderCreators } from 'modules/ducks/provider/provider.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectProviders,
  selectCreated
} from 'modules/ducks/provider/provider.selectors';

import styles from './add-iptv.styles';
import { selectSkippedProviderAdd } from 'modules/ducks/user/user.selectors';

// eslint-disable-next-line no-unused-vars
import { isValidName, isValidUsername, isValidWebsite } from 'common/validate';

class AddIptvScreen extends React.Component {
  state = {
    modalVisible: false,
    name: '',
    portal_address: '',
    username: '',
    password: '',
    valid: true,
    errors: [
      { key: 'name', val: false },
      { key: 'portal_address', val: false },
      { key: 'username', val: false },
      { key: 'password', val: false }
    ]
  };

  componentDidMount() {
    // resets provider create state
    this.props.createStartAction();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.created !== this.props.created) {
      const { created, navigation } = this.props;
      if (created) {
        /// redirect to iptv screen
        navigation.replace('IPTV');
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
    this.props.skipProviderAddAction();
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
    // eslint-disable-next-line no-unused-vars
    const { modalVisible, errors: stateError, valid, ...input } = this.state;

    // console.log({ input, stateError });

    // validation here
    if (!input.name) {
      this.setError(stateError, 'name', true);
    } else {
      this.setError(stateError, 'name', false);
    }

    if (!input.portal_address) {
      this.setError(stateError, 'portal_address', true);
    } else {
      if (!isValidWebsite(input.portal_address)) {
        this.setError(stateError, 'portal_address', true);
      } else {
        this.setError(stateError, 'portal_address', false);
      }
    }

    if (!isValidUsername(input.username)) {
      this.setError(stateError, 'username', true);
    } else {
      this.setError(stateError, 'username', false);
    }

    /// TODO: fix password validation -- Deluge@2020! is invalid
    // if (!isValidPassword(input.password)) {
    if (!input.password) {
      this.setError(stateError, 'password', true);
    } else {
      this.setError(stateError, 'password', false);
    }

    const withError = stateError.find(({ val }) => val === true);
    if (typeof withError !== 'undefined') {
      return this.setState({ valid: false });
    } else {
      this.setState({ valid: true });
    }

    // submit if no errors
    this.props.createAction({ input });

    // on success, goes back to iptv list and display a success message
  };

  handleComfirmAction = () => {
    this.props.createStartAction();
    this.setState({ modalVisible: false });
  };

  render() {
    const { skippedProviderAdd } = this.props;
    const { errors, valid, modalVisible, ...input } = this.state;

    // const [modalVisible, setModalVisible] = React.useState(false);

    let stateError = {};

    errors.map(({ key, val }) => {
      Object.assign(stateError, { [key]: val });
    });

    console.log({ errors });

    return (
      <React.Fragment>
        <ContentWrap>
          <StatusBar translucent backgroundColor="transparent" />

          <ScrollView style={{ flex: 1, marginTop: 20 }}>
            <View>
              <TextInput
                value={input.name}
                name="name"
                style={styles.textInput}
                placeholder="IPTV provider name"
                handleChangeText={this.handleChange}
                error={stateError.name}
                clearButtonMode="while-editing"
                autoCapitalize="words"
              />
              <TextInput
                value={input.portal_address}
                name="portal_address"
                style={styles.textInput}
                placeholder="Portal address"
                handleChangeText={this.handleChange}
                error={stateError.portal_address}
                keyboardType="url"
                clearButtonMode="while-editing"
                autoCapitalize="none"
              />
              <TextInput
                value={input.username}
                name="username"
                style={styles.textInput}
                placeholder="Username"
                handleChangeText={this.handleChange}
                error={stateError.username}
                clearButtonMode="while-editing"
                autoCapitalize="none"
              />
              <PasswordInput
                value={input.password}
                name="password"
                style={styles.textInput}
                handleChangeText={this.handleChange}
                error={stateError.password}
              />

              {!valid ? <Text>There are errors in your entries. Please fix!</Text> : null}
              {this.props.error && <Text>{this.props.error}</Text>}

              <Button style={styles.submit} mode="contained" onPress={() => this.handleSubmit()}>
                Add IPTV
              </Button>
            </View>
            {!skippedProviderAdd ? (
              <Pressable style={styles.skip} onPress={() => this.handleSkip()}>
                <Text>Skip for now</Text>
              </Pressable>
            ) : null}
          </ScrollView>
        </ContentWrap>
        <AlertModal
          variant="danger"
          message="Oops! Your credentials is not valid. Call your IPTV provider for assistance."
          hideAction={() => this.setState({ modalVisible: false })}
          confirmAction={() => this.handleComfirmAction()}
          visible={modalVisible}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  created: selectCreated,
  providers: selectProviders,
  skippedProviderAdd: selectSkippedProviderAdd
});

const actions = {
  createStartAction: ProviderCreators.createStart,
  createAction: ProviderCreators.create,
  skipProviderAddAction: UserCreators.skipProviderAdd
};

const enhance = compose(connect(mapStateToProps, actions), withFormWrap({ withLoader: true }));

export default enhance(AddIptvScreen);
