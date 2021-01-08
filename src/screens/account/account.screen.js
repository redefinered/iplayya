/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import ContentWrap from 'components/content-wrap.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import withLoader from 'components/with-loader.component';
import Icon from 'components/icon/icon.component';
import { Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/auth/auth.actions';
import { Creators as ProfileCreators } from 'modules/ducks/profile/profile.actions';
import {
  selectProfile,
  selectIsFetching,
  selectError as selectProfileError
} from 'modules/ducks/profile/profile.selectors';
import {
  selectError as selectAuthError,
  selectIsFetching as selectAuthIsFetching
} from 'modules/ducks/auth/auth.selectors';
import { selectUpdated } from 'modules/ducks/user/user.selectors';

import { View, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import Button from 'components/button/button.component';

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

const AccountScreen = ({
  profile,
  signOutAction,
  getProfileAction,
  profileError,
  isFetching,
  authError,
  authIsFetching,
  currentUserId,
  userUpdated,
  purgeStoreAction
}) => {
  const theme = useTheme();

  const [authErrorVisible, setAuthErrorVisible] = React.useState(false);
  const [profileErrorVisible, setProfileErrorVisible] = React.useState(false);

  React.useEffect(() => {
    if (authError !== null) {
      setAuthErrorVisible(true);
    }
    if (profileError !== null) {
      setProfileErrorVisible(true);
    }
  }, []);

  // console.log({ profile });
  const navigation = useNavigation();

  React.useEffect(() => {
    if (!profile) {
      getProfileAction();
      return;
    }
    // fixes an issue where previous user profile is being loaded from cache
    if (currentUserId === profile.id) return;
    getProfileAction();
  }, [currentUserId, profile]);

  React.useEffect(() => {
    if (userUpdated) {
      getProfileAction();
    }
  }, [userUpdated]);

  if (profileError)
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ padding: 15 }}>{profileError}</Text>
        <Button onPress={() => getProfileAction()}>Retry</Button>
        <Button onPress={() => purgeStoreAction()}>Purge store</Button>
      </View>
    );

  // console.log({ authError })

  const handleRetry = () => {
    setAuthErrorVisible(false);
  };

  const handleProfileErrorConfirmAction = () => {
    setProfileErrorVisible(false);
  };

  const handleHideProfileAlert = () => {
    setProfileErrorVisible(false);
  };

  if (isFetching || !profile) return <Text style={{ padding: 15 }}>Working...</Text>;

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
            source={require('assets/placeholder.jpg')}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            width: Dimensions.get('window').width - 100 // 100 is the 15 space left and 85 image width
          }}
        >
          {/* {profile} */}
          <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: 27, marginBottom: 2 }}>
            {profile.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              lineHeight: 19,
              marginBottom: 8,
              paddingRight: 15
            }}
          >
            {profile.email}
          </Text>
          <Pressable onPress={() => navigation.navigate('ProfileScreen')}>
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
        <Pressable
          style={styles.settingItem}
          onPress={() => navigation.navigate('PlaybackSettings')}
        >
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
            <Text style={{ fontSize: 16, lineHeight: 22 }}>
              {authIsFetching ? 'Processing...' : 'Logout'}
            </Text>
          </View>
        </Pressable>
      </View>
      {profileError && (
        <AlertModal
          variant="danger"
          message={profileError}
          visible={profileErrorVisible}
          hideAction={handleHideProfileAlert}
          confirmText="Retry"
          confirmAction={handleProfileErrorConfirmAction}
        />
      )}
      {authError ? (
        <React.Fragment>
          <AlertModal
            variant="danger"
            message={authError}
            visible={authErrorVisible}
            confirmText="Retry"
            confirmAction={handleRetry}
          />
        </React.Fragment>
      ) : null}
    </ContentWrap>
  );
};

AccountScreen.propTypes = {
  signOutAction: PropTypes.func,
  getProfileAction: PropTypes.func,
  profile: PropTypes.object
};

const actions = {
  purgeStoreAction: Creators.purgeStore, // for testing
  getProfileAction: ProfileCreators.get,
  signOutAction: Creators.signOut
};

const mapStateToProps = createStructuredSelector({
  isFetching: selectIsFetching, // this is required when using withLoader HOC
  authIsFetching: selectAuthIsFetching,
  profile: selectProfile,
  profileError: selectProfileError,
  authError: selectAuthError,
  userUpdated: selectUpdated
});

export default compose(
  withHeaderPush(),
  connect(mapStateToProps, actions),
  withLoader
)(AccountScreen);
