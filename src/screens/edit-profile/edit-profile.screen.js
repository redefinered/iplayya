/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, Platform, Pressable } from 'react-native';
import { Text, TouchableRipple, withTheme } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
import Button from 'components/button/button.component';
import MainButton from 'components/button/mainbutton.component';
import ScreenContainer from 'components/screen-container.component';
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
import { CommonActions } from '@react-navigation/routers';

class EditProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    const { first_name, last_name, name, birth_date, email, phone, gender } = props.profile;

    this.state = {
      valid: true,
      actionSheetisVisible: false,
      modalVisible: false,
      first_name: '',
      last_name: '',
      edited: false,
      // name,
      phone,
      birth_date,
      gender,
      isValidPhone,
      errors: [
        { key: 'first_name', val: false },
        { key: 'last_name', val: false },
        { key: 'phone', val: false },
        { key: 'birth_date', val: false },
        { key: 'gender', val: false }
      ]
    };
  }

  unsubscribeToBeforeRemove = null;
  ac = null;

  componentDidMount() {
    this.props.profileStartAction();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.updated !== this.props.update) {
      if (this.props.updated) this.props.navigation.navigate('ProfileScreen');
    }

    if (prevState.edited !== this.state.edited || prevProps.navigation !== this.props.navigation) {
      const { navigation } = this.props;
      this.unsubscribeToBeforeRemove = navigation.addListener('beforeRemove', (e) => {
        this.ac = e.data.action;
        if (!this.state.edited) return;

        e.preventDefault();

        this.setState({ modalVisible: true });
      });
    }
  }

  componentWillUnmount() {
    this.unsubscribeToBeforeRemove;
  }

  handleChange = (text, name) => {
    this.setState({ [name]: text, edited: true });
  };

  setError = (stateError, field, val) => {
    const index = stateError.findIndex(({ key }) => key === field);
    stateError[index].val = val;
    this.setState({ errors: stateError });
  };

  handleSubmit = () => {
    this.setState({ edited: false });
    const {
      updateAction,
      profile: { id }
    } = this.props;

    const {
      errors,
      valid,
      actionSheetisVisible,
      modalVisible,
      isValidPhone,
      edited,
      ...formdata
    } = this.state;

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

    if (isValidPhone === false) {
      this.setError(errors, 'phone', true);
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
    updateAction({ id, name: `${formdata.first_name} ${formdata.last_name}`, ...formdata });
  };

  setValidPhone = (isValidNumber) => {
    this.setState({ isValidPhone: isValidNumber });
  };

  // setEdited = () => {
  //   this.setState({ edited: });
  // };

  setBirthdate = (value) => {
    this.setState({ birth_date: value });
    if (this.props.profile.birth_date !== value) {
      this.setState({ edited: true });
    }
  };

  setPhone = (value) => {
    this.setState({ phone: value.phoneInputValue });
    if (value) {
      this.setState({ edited: true });
    }
  };

  handleSelect = (gender) => {
    this.setState({ gender, actionSheetisVisible: false });
    this.setState({ edited: true });
  };

  hideActionSheet = () => {
    this.setState({ actionSheetisVisible: false });
  };

  handleHideModal = () => {
    this.setState({ modalVisible: false });
  };

  // handleShowModal = () => {
  //   if (this.setState.count >= 2) return;
  //   this.setState({ modalVisible: true });
  // };

  handleComfirmAction = () => {
    // console.log('xxxxxx');
    this.setState({ modalVisible: false });
    this.props.navigation.dispatch(this.ac);

    // this.props.navigation.goBack();
  };

  render() {
    const { isFetching, profile } = this.props;
    const { errors, valid, showModal, modalVisible, isValidPhone, ...form } = this.state;
    const { theme } = this.props;
    console.log(profile.phone);
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
                placeholder={profile.first_name}
                handleChangeText={this.handleChange}
                error={stateError.first_name}
              />
              <TextInput
                name="last_name"
                value={form.last_name}
                style={styles.textInput}
                placeholder={profile.last_name}
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
                <PhoneNumberPicker
                  name="phone"
                  // placeholder={profile.phone == null ? '+44' : profile.phone}
                  placeholder={profile.phone}
                  setPhone={this.setPhone}
                  setValidPhone={this.setValidPhone}
                  error={stateError.phone}
                  style={{
                    borderWidth: isValidPhone ? 0 : 2,
                    borderColor: isValidPhone ? null : '#E34398'
                  }}
                />
                {!isValidPhone ? <Text style={{ margin: 2 }}>Invalid Phone Number</Text> : null}
              </View>
              <View>
                <DatePicker
                  name="birth_date"
                  // placeholder={profile.birth_date == null ? 'mm/dd/yy' : profile.birth_date}
                  placeholder={profile.birth_date}
                  setBirthdate={this.setBirthdate}
                  error={stateError.birth_date}
                  style={stateError.birth_date ? styles.errorText : null}
                />
              </View>
              <View>
                <TouchableRipple
                  borderless={true}
                  style={{ marginTop: 15, borderRadius: 8 }}
                  // style={[stateError.gender ? styles.errorText : null]}
                  onPress={() => this.setState({ actionSheetisVisible: true })}
                >
                  <View
                    pointerEvents="none"
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 15,
                      paddingHorizontal: 10,
                      ...(this.state.actionSheetisVisible
                        ? styles.textInputFocus
                        : styles.textUnfocus),
                      ...(stateError.gender ? styles.errorText : null)
                    }}
                  >
                    {form.gender == null ? (
                      <Text
                        style={[
                          this.state.gender === profile.gender
                            ? styles.textChangeColor
                            : styles.textUnchange,
                          { fontSize: 16 }
                        ]}
                      >
                        Gender
                      </Text>
                    ) : (
                      <Text
                        style={[
                          this.state.gender === profile.gender
                            ? styles.textChangeColor
                            : styles.textUnchange,
                          { fontSize: 16 }
                        ]}
                      >
                        {form.gender}
                      </Text>
                    )}
                    <View style={{ marginRight: 10, marginTop: -2 }}>
                      <Icon
                        name="account"
                        size={theme.iconSize(3)}
                        style={{ color: 'rgba(255,255,255,1)' }}
                      />
                    </View>
                  </View>
                </TouchableRipple>
              </View>
              {!valid ? <Text>There are errors in your entries</Text> : null}
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
        <AlertModal
          variant="danger"
          message="Are you sure you want to back, changes will not be save?"
          visible={modalVisible}
          hideAction={() => this.handleHideModal()}
          onCancel={() => this.handleHideModal()}
          confirmText="OK"
          confirmAction={() => this.handleComfirmAction()}
        />
      </React.Fragment>
    );
  }
}

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <EditProfileScreen {...props} />
  </ScreenContainer>
);

const actions = {
  profileStartAction: Creators.start,
  updateAction: Creators.update
};

const mapStateToProps = createStructuredSelector({
  profile: selectProfile,
  error: selectError,
  isFetching: selectIsFetching,
  updated: selectUpdated
});

// export default withFormWrap()(EditProfileScreen);

const enhance = compose(connect(mapStateToProps, actions), withTheme, withFormWrap);

export default enhance(Container);
