/* eslint-disable react/prop-types */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
import Button from 'components/button/button.component';

import withHeaderPush from 'components/with-header-push/with-header-push.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/auth/auth.actions';
import { createStructuredSelector } from 'reselect';
import { selectPwResetLinkMessage, selectError } from 'modules/ducks/auth/auth.selectors';

const styles = StyleSheet.create({
  textInput: { backgroundColor: 'rgba(255,255,255,0.1)' }
});

const ForgotPasswordScreen = ({
  error,
  navigation,
  pwResetLinkMessage,
  getPasswordResetLinkAction,
  getPasswordResetLinkStartAction,
  clearResetPasswordParamsAction
}) => {
  const [email, setEmail] = React.useState('');
  const [screenError, setScreenError] = React.useState(null);

  // eslint-disable-next-line no-unused-vars
  const handleChange = (text, name) => {
    setScreenError(null);
    setEmail(text);
  };

  const handleSend = () => {
    getPasswordResetLinkAction({ email });
  };

  React.useEffect(() => {
    getPasswordResetLinkStartAction();
    clearResetPasswordParamsAction();
  }, []);

  React.useEffect(() => {
    if (!pwResetLinkMessage) return;
    const { status, message } = pwResetLinkMessage;
    if (status === 'EMAIL_NOT_SENT') {
      return setScreenError(message);
    }
    return navigation.navigate('EmailSuccessScreen');
  }, [pwResetLinkMessage]);

  return (
    <ContentWrap style={{ paddingTop: 30 }}>
      <Text style={{ marginBottom: 20 }}>
        We will send instructions on how to reset your password in your email that you have
        registered.
      </Text>
      <TextInput
        name="email"
        placeholder="Email"
        autoCapitalize="none"
        handleChangeText={handleChange}
        style={styles.textInput}
      />
      {screenError && <Text>{screenError}</Text>}
      {error && <Text>{error}</Text>}
      <Button mode="contained" onPress={() => handleSend()}>
        Send
      </Button>
    </ContentWrap>
  );
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  pwResetLinkMessage: selectPwResetLinkMessage
});

const actions = {
  getPasswordResetLinkStartAction: Creators.getPasswordResetLinkStart,
  getPasswordResetLinkAction: Creators.getPasswordResetLink,
  clearResetPasswordParamsAction: Creators.clearResetPasswordParams
};

export default compose(withHeaderPush(), connect(mapStateToProps, actions))(ForgotPasswordScreen);
