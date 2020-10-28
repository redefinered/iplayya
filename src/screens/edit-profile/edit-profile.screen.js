/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
import Button from 'components/button/button.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import Loader from 'components/loader.component';

import withFormWrap from 'components/with-form-wrap/with-form-wrap.component';

import styles from './edit-profile.styles';

const EditProfileScreen = ({ isFething }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [invalid, setInvalid] = React.useState(false);

  return (
    <React.Fragment>
      {isFething && <Loader size="large" />}
      <ContentWrap>
        <ScrollView>
          <View>
            <TextInput style={styles.textInput} placeholder="Full name" />
            <TextInput style={styles.textInput} placeholder="Last name" />
            <TextInput style={styles.textInput} placeholder="Username" />
            <TextInput style={styles.textInput} placeholder="Email" />
            <TextInput style={styles.textInput} placeholder="(+44) xxxx xxxxxx" />
            <TextInput style={styles.textInput} placeholder="mm/dd/yy" />

            {invalid && <Text>Please fill required fields</Text>}

            <Button style={styles.submit} mode="contained">
              Save
            </Button>
          </View>
        </ScrollView>
      </ContentWrap>
      <AlertModal
        variant="danger"
        message="Are you sure you want to go back? Changes will not be saved."
        showAction={setModalVisible}
        visible={modalVisible}
      />
    </React.Fragment>
  );
};

export default withFormWrap(EditProfileScreen);
