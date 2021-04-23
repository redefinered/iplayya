/* eslint-disable react/prop-types */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from 'components/button/button.component';
import { Title, Text, withTheme } from 'react-native-paper';
import EmailSentSvg from 'assets/email_sent.svg';
import withScreenContainer from 'components/with-screen-container/with-screen-container.component';
import ContentWrap from 'components/content-wrap.component';

import { compose } from 'redux';

const EmailSuccessScreen = ({
  theme,
  navigation,
  route: {
    params: { email }
  }
}) => {
  const [counter, setCounter] = React.useState(60);
  const [enableResend, setEnableResend] = React.useState(false);

  React.useEffect(() => {
    if (counter > 0) {
      const timer = setInterval(() => {
        setCounter((counter) => counter - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [counter]);

  const {
    iplayya: { bodyp, colors }
  } = theme;

  React.useEffect(() => {
    if (counter < 0) return;
    if (counter === 0) {
      setEnableResend(true);
    } else {
      setEnableResend(false);
    }
  }, [counter]);

  const handleResendPress = () => {
    if (!enableResend) return;
    navigation.goBack();
  };

  return (
    <ContentWrap style={{ flex: 1, paddingBottom: 30 }}>
      <View style={{ flex: 10, justifyContent: 'center', alignItems: 'center' }}>
        <EmailSentSvg />
        <Title style={{ ...styles.text }}>Email Sent</Title>
        <Text style={{ ...styles.text, ...bodyp, marginBottom: 30 }}>
          An instruction on how to reset your password has been sent to your email. Please check
          your email <Text style={{ color: colors.vibrantpussy }}>{email}</Text>
        </Text>
        <Text style={{ ...bodyp, ...styles.text }}>
          Didn’t received email?{' '}
          <Text onPress={handleResendPress} style={{ color: colors.vibrantpussy }}>
            Resend{!enableResend ? ` (${counter} sec)` : null}
          </Text>
        </Text>
      </View>
      <View
        style={{
          flex: 2,
          justifyContent: 'flex-end'
        }}
      >
        <Button
          onPress={() => navigation.navigate('SignInScreen')}
          style={styles.button}
          mode="contained"
        >
          Go back to login
        </Button>
      </View>
    </ContentWrap>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center'
  },
  button: {
    fontSize: 16,
    lineHeight: 22
  }
});

export default compose(withScreenContainer({ withLoader: true }), withTheme)(EmailSuccessScreen);
