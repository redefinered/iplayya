/* eslint-disable react/prop-types */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
// import Button from 'components/button/button.component';
import MainButton from 'components/button/mainbutton.component';

import withHeaderPush from 'components/with-header-push/with-header-push.component';
//import withLoader from 'components/with-loader.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/password/password.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectGetLinkResponse
} from 'modules/ducks/password/password.selectors';

const styles = StyleSheet.create({
  textInput: { backgroundColor: 'rgba(255,255,255,0.1)' }
});

const ForgotPasswordScreen = ({
  error,
  navigation,
  getLinkResponse,
  getLinkAction,
  getLinkStartAction
}) => {
  const [email, setEmail] = React.useState('');
  const [screenError, setScreenError] = React.useState(null);

  React.useEffect(() => {
    // clear get link response
    getLinkStartAction();
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleChange = (text, name) => {
    setScreenError(null);
    setEmail(text);
  };

  const handleSend = () => {
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
        handleChangeText={handleChange}
        style={styles.textInput}
        error={error}
      />
      {screenError && <Text>{screenError}</Text>}
      {error && <Text>{error}</Text>}
      <MainButton onPress={() => handleSend()} text="Send" style={{ marginTop: 25 }} />
      {/* <Button mode="contained" onPress={() => handleSend()}>
        Send
      </Button> */}
    </ContentWrap>
  );
};

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

const enhance = compose(connect(mapStateToProps, actions), withHeaderPush({ withLoader: true }));

export default enhance(ForgotPasswordScreen);
