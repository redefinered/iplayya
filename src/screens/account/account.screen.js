/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import ContentWrap from 'components/content-wrap.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import Icon from 'components/icon/icon.component';
import { Text, withTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/auth/auth.actions';
import { selectCurrentUser } from 'modules/ducks/auth/auth.selectors';

import { View, Image, Pressable, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  iconContainer: {
    width: 42,
    justifyContent: 'center'
  }
});

const AccountScreen = ({ currentUser, signOutAction, theme }) => {
  console.log({ currentUser });
  const navigation = useNavigation();
  return (
    <ContentWrap>
      {
        // header section
      }
      <View style={{ flexDirection: 'row', marginBottom: 35 }}>
        <View style={{ width: 85 }}>
          <Image
            style={{
              width: 85,
              height: 85,
              borderRadius: 42.5,
              resizeMode: 'contain'
            }}
            source={require('images/placeholder.jpg')}
          />
        </View>
        <View style={{ paddingLeft: 15 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 27, marginBottom: 2 }}>
            {currentUser.displayName}
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 19,
              color: theme.iplayya.colors.white50,
              marginBottom: 8
            }}
          >
            {currentUser.email}
          </Text>
          <Pressable onPress={() => navigation.navigate('Profile')}>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 19,
                marginBottom: 8
              }}
            >
              View profile
            </Text>
          </Pressable>
        </View>
      </View>

      {
        // settings section
      }
      <View>
        <Text
          style={{
            fontSize: 12,
            lineHeight: 16,
            fontWeight: 'bold',
            color: theme.iplayya.colors.white50,
            marginBottom: 20
          }}
        >
          Settings
        </Text>
        <Pressable style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <Icon name="change-password" size={24} />
          </View>
          <View>
            <Text style={{ fontSize: 16, lineHeight: 22 }}>Change Password</Text>
          </View>
        </Pressable>
        <Pressable style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <Icon name="video-settings" size={24} />
          </View>
          <View>
            <Text style={{ fontSize: 16, lineHeight: 22 }}>Playback</Text>
          </View>
        </Pressable>
        <Pressable style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <Icon name="lock" size={24} />
          </View>
          <View>
            <Text style={{ fontSize: 16, lineHeight: 22 }}>Parental Control</Text>
          </View>
        </Pressable>
        <Pressable style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <Icon name="help" size={24} />
          </View>
          <View>
            <Text style={{ fontSize: 16, lineHeight: 22 }}>Need Help?</Text>
          </View>
        </Pressable>
        <Pressable style={styles.settingItem} onPress={() => signOutAction()}>
          <View style={styles.iconContainer}>
            <Icon name="logout" size={24} />
          </View>
          <View>
            <Text style={{ fontSize: 16, lineHeight: 22 }}>Logout</Text>
          </View>
        </Pressable>
      </View>
    </ContentWrap>
  );
};

AccountScreen.propTypes = {
  signOutAction: PropTypes.func
};

const actions = {
  signOutAction: Creators.signOut
};

const mapStateToProps = createStructuredSelector({ currentUser: selectCurrentUser });

export default compose(withHeaderPush, withTheme, connect(mapStateToProps, actions))(AccountScreen);
