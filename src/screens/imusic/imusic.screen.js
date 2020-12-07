import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Icon from 'components/icon/icon.component';
import Button from 'components/button/button.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import ContentWrap from 'components/content-wrap.component';
import Spacer from 'components/spacer.component';
import EmptyLibrary from 'assets/imusic-empty-lib.svg';

import { compose } from 'redux';
import { createFontFormat } from 'utils';

import library from './dummy-data.json';

const ImusicScreen = ({ navigation, theme }) => {
  return (
    <View style={styles.container}>
      {library.length ? (
        <ContentWrap>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...createFontFormat(16, 22) }}>Music Library</Text>
            <Pressable>
              <Text
                style={{ color: theme.iplayya.colors.vibrantpussy, ...createFontFormat(16, 22) }}
              >
                Add music
              </Text>
            </Pressable>
          </View>
        </ContentWrap>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <EmptyLibrary />
          <Spacer size={30} />
          <Text style={{ fontWeight: 'bold', ...createFontFormat(20, 27) }}>Lets get started</Text>
          <Spacer size={20} />
          <ContentWrap>
            <Text style={{ textAlign: 'center', ...createFontFormat(14, 19) }}>
              Browse Audio files on your device and start playing music anywhere and anytime you
              are!
            </Text>
            <Spacer size={20} />
            <Button mode="contained">Browse files</Button>
          </ContentWrap>
        </View>
      )}

      {/* this element pushes the content so the bottom nav does not go over the content */}
      <View style={{ paddingBottom: 100 }} />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: '#202530',
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          paddingHorizontal: 30,
          paddingTop: 15,
          paddingBottom: 30,
          position: 'absolute',
          width: '100%',
          bottom: 0
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => navigation.replace('HomeScreen')}
          style={{ alignItems: 'center' }}
        >
          <Icon name="iplayya" size={40} />
          <Text style={{ textTransform: 'uppercase', marginTop: 5 }}>Home</Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

ImusicScreen.propTypes = {
  navigation: PropTypes.object,
  theme: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default compose(withHeaderPush('solid'), withTheme)(ImusicScreen);
