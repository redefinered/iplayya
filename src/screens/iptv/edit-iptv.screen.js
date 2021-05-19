/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
import PasswordInput from 'components/password-input/password-input.component';
// import Button from 'components/button/button.component';
import MainButton from 'components/button/mainbutton.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
//import withLoader from 'components/with-loader.component';
import withFormWrap from 'components/with-form-wrap/with-form-wrap.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/provider/provider.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectIsFetching,
  selectError,
  selectUpdated
} from 'modules/ducks/provider/provider.selectors';

// eslint-disable-next-line no-unused-vars
import { isValidUsername, isValidWebsite, isValidPassword } from 'common/validate';

import styles from './add-iptv.styles';

class EditIptvScreen extends React.Component {
  constructor(props) {
    super(props);

    const {
      params: {
        provider: { id, name, portal_address, username, password }
      }
    } = props.route;

    this.state = {
      modalVisible: false,
      id,
      name,
      portal_address,
      username,
      password,
      valid: true,
      errors: [
        { key: 'name', val: false },
        { key: 'portal_address', val: false },
        { key: 'username', val: false },
        { key: 'password', val: false }
      ]
    };
  }

  componentDidMount() {
    // resets provider create state
    this.props.updateStartAction();
    this.props.createStartAction();
    this.props.enableSwipeAction(false);
  }

  handleChange = (text, name) => {
    this.setState({ [name]: text });
  };

  setError = (stateError, field, val) => {
    const index = stateError.findIndex(({ key }) => key === field);
    stateError[index].val = val;
    this.setState({ errors: stateError });
  };

  handleSubmit = () => {
    // eslint-disable-next-line no-unused-vars
    const { modalVisible, errors: stateError, valid, ...input } = this.state;

    // validation here
    if (input.name === '') {
      this.setError(stateError, 'name', true);
    } else {
      this.setError(stateError, 'name', false);
    }

    // if (!isValidWebsite(input.portal_address)) {
    //   this.setError(stateError, 'portal_address', true);
    // } else {
    //   this.setError(stateError, 'portal_address', false);
    // }

    if (!isValidUsername(input.username)) {
      this.setError(stateError, 'username', true);
    } else {
      this.setError(stateError, 'username', false);
    }

    /// TODO: fix password validation -- Deluge@2020! is invalid
    // if (!isValidPassword(input.password)) {
    if (!input.password) {
      return this.setError(stateError, 'password', true);
    } else {
      this.setError(stateError, 'password', false);
    }

    const withError = stateError.find(({ val }) => val === true);
    if (typeof withError !== 'undefined') {
      return this.setState({ valid: false });
    } else {
      this.setState({ valid: true });
    }

    console.log('no errors! submit.');

    // submit if no errors
    this.props.updateAction({ input });

    // on success, goes back to iptv list and display a success message
  };

  componentDidUpdate(prevProps) {
    if (prevProps.updated !== this.props.updated) {
      const { updated, navigation } = this.props;
      if (updated) {
        navigation.replace('IPTV');
      }
    }
  }

  render() {
    const { errors, valid, modalVisible, ...form } = this.state;

    let stateError = {};

    errors.map(({ key, val }) => {
      Object.assign(stateError, { [key]: val });
    });

    return (
      <React.Fragment>
        <ContentWrap>
          <ScrollView style={{ marginTop: 20 }}>
            <View>
              <TextInput
                name="name"
                value={form.name}
                style={styles.textInput}
                placeholder="IPTV provider name"
                handleChangeText={this.handleChange}
                error={stateError.name}
                clearButtonMode="while-editing"
                autoCapitalize="words"
              />
              <TextInput
                name="portal_address"
                value={form.portal_address}
                style={styles.textInput}
                placeholder="Portal address"
                handleChangeText={this.handleChange}
                error={stateError.portal_address}
                autoCapitalize="none"
              />
              <TextInput
                name="username"
                value={form.username}
                style={styles.textInput}
                placeholder="Username"
                handleChangeText={this.handleChange}
                error={stateError.username}
              />
              <PasswordInput
                name="password"
                value={form.password}
                style={styles.textInput}
                handleChangeText={this.handleChange}
                error={stateError.password}
              />

              {!valid ? <Text>There are errors in your entries. Please fix!</Text> : null}
              {this.props.error && <Text>{this.props.error}</Text>}

              <MainButton
                onPress={() => this.handleSubmit()}
                text="Save"
                style={{ ...styles.submit }}
              />
              {/* <Button style={styles.submit} mode="contained" onPress={() => this.handleSubmit()}>
                Save
              </Button> */}
            </View>
          </ScrollView>
        </ContentWrap>
        <AlertModal
          variant="danger"
          message="Oops! Your credentials is not valid. Call your IPTV provider for assistance."
          hideAction={() => this.setState({ modalVisible: false })}
          visible={modalVisible}
        />
      </React.Fragment>
    );
  }
}

const actions = {
  updateStartAction: Creators.updateStart,
  createStartAction: Creators.createStart,
  updateAction: Creators.update,
  enableSwipeAction: NavActionCreators.enableSwipe
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  updated: selectUpdated
});

const enhance = compose(connect(mapStateToProps, actions), withFormWrap({ withLoader: true }));

export default enhance(EditIptvScreen);
