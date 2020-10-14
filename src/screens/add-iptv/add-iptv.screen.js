import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
import PasswordInput from 'components/password-input/password-input.component';
import Button from 'components/button/button.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import { useHeaderHeight } from '@react-navigation/stack';

import styles from './add-iptv.styles';

const AddIptvScreen = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const headerHeight = useHeaderHeight();
  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ContentWrap style={{ paddingTop: headerHeight, ...styles.content }}>
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
      </KeyboardAvoidingView>
      <AlertModal showAction={setModalVisible} visible={modalVisible} />
    </ScreenContainer>
  );
};

export default AddIptvScreen;
