/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
import Button from 'components/button/button.component';
// import AlertModal from 'components/alert-modal/alert-modal.component';
import Loader from 'components/loader.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/profile/profile.actions';
import {
  selectError,
  selectIsFetching,
  selectProfile,
  selectUpdated
} from 'modules/ducks/profile/profile.selectors';
import { createStructuredSelector } from 'reselect';

import withFormWrap from 'components/with-form-wrap/with-form-wrap.component';
import withLoader from 'components/with-loader.component';

import styles from './edit-profile.styles';

import { isValidName, isValidUsername, isValidPhone } from 'common/validate';

class EditProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    const { name, last_name, username, email, phone, gender } = props.profile;

    this.state = {
      valid: true,
      name,
      last_name,
      username,
      phone,
      gender,
      errors: [
        { key: 'name', val: false },
        { key: 'last_name', val: false },
        { key: 'username', val: false },
        { key: 'phone', val: false },
        { key: 'gender', val: false }
      ]
    };
  }

  componentDidMount() {
    this.props.updateStartAction();
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
    const {
      updateAction,
      profile: { id }
    } = this.props;

    const { errors, valid, ...formdata } = this.state;

    console.log({ formdata });

    if (!isValidName(formdata.name)) {
      this.setError(errors, 'name', true);
    } else {
      this.setError(errors, 'name', false);
    }

    if (!isValidName(formdata.last_name)) {
      this.setError(errors, 'last_name', true);
    } else {
      this.setError(errors, 'last_name', false);
    }

    if (!isValidUsername(formdata.username)) {
      this.setError(errors, 'username', true);
    } else {
      this.setError(errors, 'username', false);
    }

    if (!isValidPhone(formdata.phone)) {
      this.setError(errors, 'phone', true);
    } else {
      this.setError(errors, 'phone', false);
    }

    if (formdata.gender === '') {
      this.setError(errors, 'phone', true);
    } else {
      this.setError(errors, 'phone', false);
    }

    const withError = errors.find(({ val }) => val === true);
    if (typeof withError !== 'undefined') {
      return this.setState({ valid: false });
    } else {
      this.setState({ valid: true });
    }

    // updateAction
    updateAction({ id, ...formdata });
  };

  componentDidUpdate() {
    if (this.props.updated) this.props.navigation.goBack();
  }

  render() {
    const { isFetching, profile } = this.props;
    const { errors, valid, showModal, ...form } = this.state;

    let stateError = {};

    errors.map(({ key, val }) => {
      Object.assign(stateError, { [key]: val });
    });

    return (
      <React.Fragment>
        {isFetching && <Loader size="large" />}
        <ContentWrap>
          <ScrollView>
            <View>
              <TextInput
                name="name"
                value={form.name}
                style={styles.textInput}
                placeholder="Full name"
                handleChangeText={this.handleChange}
                error={stateError.name}
              />
              <TextInput
                name="last_name"
                value={form.last_name}
                style={styles.textInput}
                placeholder="Last name"
                handleChangeText={this.handleChange}
                error={stateError.last_name}
              />
              <TextInput
                name="username"
                value={form.username}
                style={styles.textInput}
                placeholder="Username"
                handleChangeText={this.handleChange}
                error={stateError.username}
                autoCapitalize="none"
              />
              <TextInput
                name="phone"
                value={form.phone}
                style={styles.textInput}
                placeholder="(+44) xxxx xxxxxx"
                handleChangeText={this.handleChange}
                error={stateError.phone}
              />
              <TextInput
                name="gender"
                value={form.gender}
                style={styles.textInput}
                placeholder="gender"
                handleChangeText={this.handleChange}
                error={stateError.gender}
              />

              {!valid ? <Text>There are errors in your entries. Please fix!</Text> : null}
              {this.props.error && <Text>{this.props.error}</Text>}

              <Button onPress={() => this.handleSubmit()} style={styles.submit} mode="contained">
                Save
              </Button>
            </View>
          </ScrollView>
        </ContentWrap>
      </React.Fragment>
    );
  }
}

const actions = { updateStartAction: Creators.updateStart, updateAction: Creators.update };

const mapStateToProps = createStructuredSelector({
  profile: selectProfile,
  error: selectError,
  isFetching: selectIsFetching,
  updated: selectUpdated
});

// export default withFormWrap()(EditProfileScreen);
export default compose(
  withFormWrap(),
  connect(mapStateToProps, actions),
  withLoader
)(EditProfileScreen);
