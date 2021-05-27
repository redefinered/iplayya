/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, Platform, Pressable } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
import Button from 'components/button/button.component';
import MainButton from 'components/button/mainbutton.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
// import Loader from 'components/loader.component';
import Icon from 'components/icon/icon.component';

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
// import withLoader from 'components/with-loader.component';

import styles from './edit-profile.styles';

import { isValidName, isValidBirthday, isValidPhone } from 'common/validate';
import moment, { relativeTimeRounding } from 'moment';
import DatePicker from 'components/date-picker/date-picker.component';
import ActionSheet from 'components/action-sheet/action-sheet.component';
import PhoneNumberPicker from 'components/phone-number-picker/phone-number-picker.component';

class EditProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    const { first_name, last_name, birth_date, email, phone, gender } = props.profile;

    this.state = {
      valid: true,
      actionSheetisVisible: false,
      first_name,
      last_name,
      phone,
      birth_date,
      gender: 'Gender',
      errors: [
        { key: 'first_name', val: false },
        { key: 'last_name', val: false },
        { key: 'phone', val: false },
        { key: 'birth_date', val: false },
        { key: 'gender', val: false }
      ]
    };
  }

  componentDidMount() {
    // console.log(isValidBirthday('xxx'));
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

    const { errors, valid, actionSheetisVisible, ...formdata } = this.state;

    console.log({ formdata, actionSheetisVisible });

    if (!isValidName(formdata.first_name)) {
      this.setError(errors, 'first_name', true);
    } else {
      this.setError(errors, 'first_name', false);
    }

    if (!isValidName(formdata.last_name)) {
      this.setError(errors, 'last_name', true);
    } else {
      this.setError(errors, 'last_name', false);
    }

    if (!isValidBirthday(formdata.birth_date)) {
      this.setError(errors, 'birth_date', true);
    } else {
      this.setError(errors, 'birth_date', false);
    }

    if (formdata.phone === '') {
      if (!isValidPhone(formdata.phone)) {
        this.setError(errors, 'phone', true);
      } else {
        this.setError(errors, 'phone', false);
      }
    } else {
      this.setError(errors, 'phone', false);
    }

    if (formdata.gender === 'Gender') {
      this.setError(errors, 'gender', true);
    } else {
      this.setError(errors, 'gender', false);
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

  setBirthdate = (value) => {
    this.setState({ birth_date: value });
  };

  setPhone = (value) => {
    this.setState({ phone: value.phoneInputValue });
  };

  handleSelect = (gender) => {
    this.setState({ gender, actionSheetisVisible: false });
  };

  hideActionSheet = () => {
    this.setState({ actionSheetisVisible: false });
  };

  render() {
    const { isFetching, profile } = this.props;
    const { errors, valid, showModal, ...form } = this.state;
    console.log('yyy', errors);
    const actions = [
      {
        key: 'male',
        icon: 'null',
        title: 'Male',
        onPress: this.handleSelect,
        data: 'Male'
      },
      {
        key: 'female',
        icon: 'null',
        title: 'Female',
        onPress: this.handleSelect,
        data: 'Female'
      }
    ];

    let stateError = {};

    errors.map(({ key, val }) => {
      Object.assign(stateError, { [key]: val });
    });

    return (
      <React.Fragment>
        {/* {isFetching && <Loader size="large" />} */}
        <ContentWrap>
          <ScrollView>
            <View style={{ marginTop: 30 }}>
              <TextInput
                name="first_name"
                value={form.first_name}
                style={styles.textInput}
                placeholder="First name"
                handleChangeText={this.handleChange}
                error={stateError.first_name}
              />
              <TextInput
                name="last_name"
                value={form.last_name}
                style={styles.textInput}
                placeholder="Last name"
                handleChangeText={this.handleChange}
                error={stateError.last_name}
              />
              {/* <TextInput
                name="phone"
                value={form.phone}
                style={styles.textInput}
                placeholder="(+44) xxxx xxxxxx"
                handleChangeText={this.handleChange}
                error={stateError.phone}
                autoCapitalize="none"
                keyboardType="number-pad"
              /> */}
              <View>
                <PhoneNumberPicker name="phone" setPhone={this.setPhone} error={stateError.phone} />
              </View>
              <View>
                <DatePicker
                  name="birth_date"
                  setBirthdate={this.setBirthdate}
                  error={stateError.birth_date}
                  style={stateError.birth_date ? styles.errorText : null}
                />
              </View>
              <TouchableRipple
                borderless={true}
                style={[
                  this.state.gender === 'Gender' ? styles.textUnfocus : styles.textInputFocus,
                  stateError.gender ? styles.errorText : null
                ]}
                onPress={() => this.setState({ actionSheetisVisible: true })}
              >
                <View
                  pointerEvents="none"
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 15,
                    paddingHorizontal: 10
                  }}
                >
                  <Text
                    style={[
                      this.state.gender === 'Gender' ? styles.textChangeColor : styles.textUnchange,
                      { fontSize: 16 }
                    ]}
                  >
                    {form.gender}
                  </Text>
                  <View style={{ marginRight: 10, marginTop: -2 }}>
                    <Icon name="account" size={25} style={{ color: 'rgba(255,255,255,1)' }} />
                  </View>
                </View>
              </TouchableRipple>
              {!valid ? <Text>There are errors in your entries. Please fix!</Text> : null}
              {this.props.error && <Text>{this.props.error}</Text>}
              <MainButton
                onPress={() => this.handleSubmit()}
                text="Save"
                style={{ ...styles.submit, marginTop: 30 }}
              />
              {/* <Button onPress={() => this.handleSubmit()} style={styles.submit} mode="contained">
                Save
              </Button> */}
            </View>
          </ScrollView>
        </ContentWrap>
        <ActionSheet
          visible={this.state.actionSheetisVisible}
          actions={actions}
          hideAction={this.hideActionSheet}
        />
      </React.Fragment>
    );
  }
}

const actions = {
  updateStartAction: Creators.updateStart,
  updateAction: Creators.update
};

const mapStateToProps = createStructuredSelector({
  profile: selectProfile,
  error: selectError,
  isFetching: selectIsFetching,
  updated: selectUpdated
});

// export default withFormWrap()(EditProfileScreen);

const enhance = compose(connect(mapStateToProps, actions), withFormWrap());

export default enhance(EditProfileScreen);
