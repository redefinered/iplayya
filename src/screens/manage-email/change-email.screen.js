/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */

import React from 'react';
// import PropTypes from 'prop-types';
import ContentWrap from 'components/content-wrap.component';
import ScreenContainer from 'components/screen-container.component';
import MainButton from 'components/button/mainbutton.component';
import TextInput from 'components/text-input/text-input.component';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import withLoader from 'components/with-loader.component';
import withFormWrap from 'components/with-form-wrap/with-form-wrap.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators as ProfileCreators } from 'modules/ducks/profile/profile.actions';
import { createStructuredSelector } from 'reselect';
import { selectError, selectIsFetching } from 'modules/ducks/auth/auth.selectors';

import { isValidEmail } from 'common/validate';

class ChangeEmailScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      // id,
      // email,
      // password,
      valid: true,
      errors: [{ key: 'email', val: false }]
    };
  }

  componentDidMount() {
    this.props.getProfileAction();
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

    if (!isValidEmail(input.email)) {
      this.setError(stateError, 'email', true);
    } else {
      this.setError(stateError, 'email', false);
    }

    const withError = stateError.find(({ val }) => val === true);
    if (typeof withError !== 'undefined') {
      return this.setState({ valid: false });
    } else {
      this.setState({ valid: true });
    }

    console.log('no errors! submit.');
  };

  render() {
    const { errors, valid, modalVisible, ...form } = this.state;

    let stateError = {};

    errors.map(({ key, val }) => {
      Object.assign(stateError, { [key]: val });
    });

    return (
      <ContentWrap>
        <Text
          style={{ marginBottom: 20, textAlign: 'center', paddingHorizontal: 60, fontSize: 16 }}
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
            placeholder="Email"
          />
          {!valid ? <Text>There are errors in your entries. Please fix!</Text> : null}
          {this.props.error && <Text>{this.props.error}</Text>}
          <MainButton text="Submit" />
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
  getProfileAction: ProfileCreators.get
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching
});

const enhance = compose(connect(mapStateToProps, actions), withFormWrap, withLoader);

export default enhance(Container);
