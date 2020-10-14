import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import ContentWrap from 'components/content-wrap.component';
import TextInput from 'components/text-input/text-input.component';
import PasswordInput from 'components/password-input/password-input.component';
import Button from 'components/button/button.component';
import { useHeaderHeight } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';

const AddIptvScreen = () => {
  const headerHeight = useHeaderHeight();
  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ContentWrap
          style={{
            flex: 1,
            justifyContent: 'space-between',
            paddingTop: headerHeight
          }}
        >
          <ScrollView>
            <View>
              <TextInput style={styles.textInput} placeholder="IPTV provider name" />
              <TextInput style={styles.textInput} placeholder="Portal address" />
              <TextInput style={styles.textInput} placeholder="Username" />
              <PasswordInput style={styles.textInput} />
              <Button style={{ marginBottom: 30, marginTop: 15 }} mode="contained">
                Add IPTV
              </Button>
            </View>
            <Pressable style={{ alignItems: 'center', paddingBottom: 50 }}>
              <Text>Skip for now</Text>
            </Pressable>
          </ScrollView>
        </ContentWrap>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  textInput: { backgroundColor: 'rgba(255,255,255,0.1)' }
});

export default AddIptvScreen;
