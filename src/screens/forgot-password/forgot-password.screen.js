/* eslint-disable react/prop-types */

import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
import MainButton from 'components/button/mainbutton.component';
import withLoader from 'components/with-loader.component';
import ScreenContainer from 'components/screen-container.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/password/password.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectGetLinkResponse
} from 'modules/ducks/password/password.selectors';

import { isValidEmail } from 'common/validate';

const styles = StyleSheet.create({
  textInput: { backgroundColor: 'rgba(255,255,255,0.1)' }
});

const ForgotPasswordScreen = ({
  error: forgotError,
  navigation,
  getLinkResponse,
  getLinkAction,
  getLinkStartAction
}) => {
  const [email, setEmail] = React.useState('');
  const [screenError, setScreenError] = React.useState(null);
  const [error, setError] = React.useState({ email: null, commonError: null });

  React.useEffect(() => {
    // clear get link response
    getLinkStartAction();
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleChange = (text, name) => {
    setScreenError(null);
    setEmail(text.toLowerCase());
    if (name === 'email') {
      if (!isValidEmail(text)) {
        setError({ email: 'Invalid email address' });
      } else {
        setError({ email: null });
      }
    }
  };

  const handleSend = () => {
    if (!email.length) {
      setError({ email: 'Please fill required fields' });
      return;
    }

    setError({ email: null });
    getLinkAction({ email });
  };

  React.useEffect(() => {
    if (!getLinkResponse) return;
    const { status, message } = getLinkResponse;
    if (status === 'EMAIL_NOT_SENT') {
      return setScreenError(message);
    }
    return navigation.navigate('EmailSuccessScreen', { email });
  }, [getLinkResponse]);

  return (
    <ContentWrap style={{ marginTop: 30 }}>
      <Text style={{ marginBottom: 20 }}>
        We will send instructions on how to reset your password in your email that you have
        registered.
      </Text>
      <TextInput
        name="email"
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        keyboardType={Platform.OS === 'ios' ? 'default' : 'visible-password'}
        handleChangeText={handleChange}
        style={styles.textInput}
        error={forgotError || error.email}
      />
      {error.email ? <Text>{error.email}</Text> : null}
      {screenError ? <Text>{screenError}</Text> : null}
      {forgotError ? <Text>{forgotError}</Text> : null}
      <MainButton onPress={() => handleSend()} text="Send" style={{ marginTop: 25 }} />
      {/* <Button mode="contained" onPress={() => handleSend()}>
        Send
      </Button> */}
    </ContentWrap>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ForgotPasswordScreen {...props} />
  </ScreenContainer>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  getLinkResponse: selectGetLinkResponse
});

const actions = {
  getLinkAction: Creators.getLink,
  getLinkStartAction: Creators.getLinkStart,
  updateStartAction: Creators.updateStart
};

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
