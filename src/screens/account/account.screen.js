/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import ContentWrap from 'components/content-wrap.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
//import withLoader from 'components/with-loader.component';
import Icon from 'components/icon/icon.component';
import { Text, useTheme, TouchableRipple } from 'react-native-paper';
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

import { View, Image, Pressable, StyleSheet, Dimensions, PixelRatio, Platform } from 'react-native';
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

const { width: SCREEN_WIDTH /*, height: SCREEN_HEIGHT */ } = Dimensions.get('window');

const scale = SCREEN_WIDTH / 375;

function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS == 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

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
  const [onSigningOut, setOnSigningOut] = React.useState(false);

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
  const handleHideOnSignOut = () => {
    setOnSigningOut(false);
  };

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
    <ContentWrap style={{ flex: 1, paddingTop: 20, marginBottom: 140 }}>
      {
        // header section
      }
      <View style={{ flexDirection: 'row', marginBottom: 35 }}>
        <View style={{ width: 85 }}>
          <Image
            style={{
              width: 85,
              height: 85,
              borderRadius: 300 / 2,
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
          <Text
            style={{ fontSize: normalize(21), fontWeight: 'bold', lineHeight: 22, marginBottom: 5 }}
          >
            {profile.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: normalize(14),
              lineHeight: 19,
              marginBottom: 8,
              paddingRight: 15,
              color: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            {profile.email}
          </Text>
          <Pressable onPress={() => navigation.navigate('ProfileScreen')}>
            <Text
              style={{
                fontSize: normalize(15),
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
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          height: 'auto'
          // marginBottom: newHeight
        }}
      >
        <Text
          style={{
            fontSize: normalize(15),
            lineHeight: 16,
            fontWeight: 'bold',
            color: theme.iplayya.colors.white50,
            marginBottom: 10
          }}
        >
          Settings
        </Text>
        <TouchableRipple>
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Icon name="change-password" size={24} />
            </View>
            <View>
              <Text style={{ fontSize: normalize(18), lineHeight: 22 }}>Change Password</Text>
            </View>
          </View>
        </TouchableRipple>
        <TouchableRipple>
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Icon name="email" size={24} />
            </View>
            <View>
              <Text style={{ fontSize: normalize(18), lineHeight: 22 }}>Manage Email</Text>
            </View>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => navigation.navigate('PlaybackSettings')}>
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Icon name="video-quality" size={24} />
            </View>
            <View>
              <Text style={{ fontSize: normalize(18), lineHeight: 22 }}>Playback</Text>
            </View>
          </View>
        </TouchableRipple>
        <TouchableRipple>
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Icon name="lock" size={24} />
            </View>
            <View>
              <Text style={{ fontSize: normalize(18), lineHeight: 22 }}>Parental Control</Text>
            </View>
          </View>
        </TouchableRipple>
        <TouchableRipple>
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Icon name="help" size={24} />
            </View>
            <View>
              <Text style={{ fontSize: normalize(18), lineHeight: 22 }}>Need Help?</Text>
            </View>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => setOnSigningOut(true)}>
          <View style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Icon name="logout" size={24} />
            </View>
            <View>
              <Text style={{ fontSize: normalize(18), lineHeight: 22 }}>
                {authIsFetching ? 'Processing...' : 'Logout'}
              </Text>
            </View>
          </View>
        </TouchableRipple>
        <AlertModal
          variant="danger"
          message="Are you sure you want to Logout?"
          visible={onSigningOut}
          hideAction={handleHideOnSignOut}
          onCancel={handleHideOnSignOut}
          confirmText="OK"
          confirmAction={signOutAction}
        />
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

const enhance = compose(connect(mapStateToProps, actions), withHeaderPush({ withLoader: true }));
export default enhance(AccountScreen);
