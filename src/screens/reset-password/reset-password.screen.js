/* eslint-disable no-unused-vars */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
import Button from 'components/button/button.component';
import AlertModal from 'components/alert-modal/alert-modal.component';

import withHeaderPush from 'components/with-header-push/with-header-push.component';

const styles = StyleSheet.create({
  textInput: { backgroundColor: 'rgba(255,255,255,0.1)' }
});

const ResetPasswordScreen = () => {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <React.Fragment>
      <ContentWrap style={{ paddingTop: 30 }}>
        <Text style={{ marginBottom: 20 }}>
          You have requested to reset your password. Enter your new password below.
        </Text>
        <TextInput style={styles.textInput} placeholder="Enter new password" />
        <TextInput style={styles.textInput} placeholder="Confirm new password" />
        <Button onPress={() => setModalVisible(true)} mode="contained">
          Reset
        </Button>
      </ContentWrap>
      <AlertModal
        variant="success"
        message="You can now use your new password to login to your account."
        showAction={setModalVisible}
        visible={modalVisible}
        confirmText="Login"
      />
    </React.Fragment>
  );
};

export default withHeaderPush(ResetPasswordScreen);
