/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Pressable, View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
import PasswordInput from 'components/password-input/password-input.component';
import Button from 'components/button/button.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import Loader from 'components/loader.component';

import WithFormWrap from 'components/with-form-wrap/with-form-wrap.component';

import styles from './add-iptv.styles';

const AddIptvScreen = ({ isFething }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  return (
    <React.Fragment>
      {isFething && <Loader size="large" />}
      <ContentWrap style={styles.content}>
        <ScrollView>
          <View>
            <TextInput style={styles.textInput} placeholder="IPTV provider name" />
            <TextInput style={styles.textInput} placeholder="Portal address" />
            <TextInput style={styles.textInput} placeholder="Username" />
            <PasswordInput style={styles.textInput} />
            <Button style={styles.submit} mode="contained" onPress={() => setModalVisible(true)}>
              Add IPTV
            </Button>
          </View>
          <Pressable style={styles.skip}>
            <Text>Skip for now</Text>
          </Pressable>
        </ScrollView>
      </ContentWrap>
      <AlertModal
        message="Oops! Your credentials is not valid. Call your IPTV provider for assistance."
        showAction={setModalVisible}
        visible={modalVisible}
      />
    </React.Fragment>
  );
};

export default WithFormWrap(AddIptvScreen);
