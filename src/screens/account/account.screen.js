/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import ContentWrap from 'components/content-wrap.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import ScreenContainer from 'components/screen-container.component';
import Icon from 'components/icon/icon.component';
import { Text, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators } from 'modules/ducks/auth/auth.actions';
import { Creators as ProfileCreators } from 'modules/ducks/profile/profile.actions';
import { Creators as PasswordActionCreators } from 'modules/ducks/password/password.actions';
import {
  selectProfile,
  selectError as selectProfileError
} from 'modules/ducks/profile/profile.selectors';
import {
  selectError as selectAuthError,
  selectIsFetching as selectAuthIsFetching
} from 'modules/ducks/auth/auth.selectors';
import { selectUpdated } from 'modules/ducks/user/user.selectors';
import { selectUpdated as selectPasswordUpdated } from 'modules/ducks/password/password.selectors';
import {
  View,
  Image,
  // Pressable,
  StyleSheet,
  Dimensions,
  SafeAreaView
  // PixelRatio,
  // Platform,
} from 'react-native';
import SnackBar from 'components/snackbar/snackbar.component';
import Button from 'components/button/button.component';
import theme from 'common/theme';
import WalkThrougGuide from 'components/walkthrough-guide/walkthrough-guide.component';
import withNotifRedirect from 'components/with-notif-redirect.component';
import { compose } from 'redux';

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row'
  },
  iconContainer: {
    width: 42,
    justifyContent: 'center'
  }
});

// const { width: SCREEN_WIDTH /*, height: SCREEN_HEIGHT */ } = Dimensions.get('window');

// const scale = SCREEN_WIDTH / 375;

// function normalize(size) {
//   const newSize = size * scale;
//   if (Platform.OS == 'ios') {
//     return Math.round(PixelRatio.roundToNearestPixel(newSize));
//   } else {
//     return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
//   }
// }

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
  passwordUpdated,
  route: { params },
  getProfileStartAction,
  resetAction,
  changePasswordStartAction
}) => {
  const [authErrorVisible, setAuthErrorVisible] = React.useState(false);
  const [profileErrorVisible, setProfileErrorVisible] = React.useState(false);
  const [onSigningOut, setOnSigningOut] = React.useState(false);
  const [showPasswordChangedModal, setShowPasswordChangedModal] = React.useState(false);
  const [showWalkthroughGuide, setShowWalkthroughGuide] = React.useState(false);
  const [showAccountStepTwo, setShowAccountStepTwo] = React.useState(false);

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
      getProfileStartAction();
    }
  }, [userUpdated]);

  React.useEffect(() => {
    if (passwordUpdated) handlePasswordChanged();
    hideSnackBar();
    changePasswordStartAction();
  }, [passwordUpdated]);

  const handlePasswordChanged = () => {
    setShowPasswordChangedModal(true);
    passwordUpdated;
  };

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowPasswordChangedModal(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (params) {
      setShowWalkthroughGuide(params.openAccountGuide);
    }
  }, [params]);

  const handleAccountGuideVisible = () => {
    setShowWalkthroughGuide(false);
  };

  const handleAccountNextGuide = () => {
    setShowWalkthroughGuide(false);
    setShowAccountStepTwo(true);
  };

  const handleAccountStepTwo = () => {
    setShowAccountStepTwo(false);
  };

  if (profileError)
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ padding: 15 }}>{profileError}</Text>
        <Button onPress={() => getProfileAction()}>Retry</Button>
        <Button onPress={() => resetAction()}>RESET (for development only)</Button>
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
    <SafeAreaView style={{ flex: 1, paddingTop: 40 }}>
      <ContentWrap style={{ flex: 1 }}>
        {
          // header section
        }
        <View style={{ flexDirection: 'row', marginBottom: 35 }}>
          <View style={{ width: 85 }}>
            <Image
              style={{
                width: 80,
                height: 80,
                borderRadius: 300,
                resizeMode: 'contain'
              }}
              source={require('assets/Avatar_Eclipse.png')}
            />
          </View>
          <View
            style={{
              // paddingHorizontal: 15,
              width: Dimensions.get('window').width - 100 // 100 is the 15 space left and 85 image width
            }}
          >
            {/* {profile} */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                lineHeight: 22,
                marginBottom: theme.spacing(1),
                paddingHorizontal: theme.spacing(2)
              }}
            >
              {profile.name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                lineHeight: 19,
                paddingHorizontal: theme.spacing(2),
                color: theme.iplayya.colors.white50
              }}
            >
              {profile.email}
            </Text>
            <View style={{ alignItems: 'flex-start' }}>
              <TouchableRipple
                borderless={false}
                rippleColor="rgba(0,0,0,0.28)"
                onPress={() => navigation.navigate('ProfileScreen')}
                style={{
                  padding: theme.spacing(1),
                  marginLeft: theme.spacing(1)
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 19
                    }}
                  >
                    View Profile
                  </Text>
                </View>
              </TouchableRipple>
            </View>
          </View>
        </View>
      </ContentWrap>

      {
        // settings section
      }

      <View
        style={{
          flex: 6
          // marginBottom: newHeight
        }}
      >
        <Text
          style={{
            fontSize: 12,
            lineHeight: 16,
            fontWeight: 'bold',
            color: theme.iplayya.colors.white50,
            padding: theme.spacing(2),
            marginBottom: theme.spacing(2)
          }}
        >
          Settings
        </Text>
        <View
          style={{
            flex: 2,
            flexDirection: 'column'
          }}
        >
          <TouchableRipple
            borderless={false}
            rippleColor="rgba(0,0,0,0.28)"
            onPress={() => navigation.navigate('ChangePasswordScreen')}
          >
            <View style={{ ...styles.settingItem, padding: theme.spacing(2) }}>
              <View style={styles.iconContainer}>
                <Icon name="change-password" size={theme.iconSize(3)} />
              </View>
              <View>
                <Text style={{ fontSize: 16, lineHeight: 22 }}>Change Password</Text>
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple
            rippleColor="rgba(0,0,0,0.28)"
            onPress={() => navigation.navigate('ManageEmailScreen')}
          >
            <View style={{ ...styles.settingItem, padding: theme.spacing(2) }}>
              <View style={styles.iconContainer}>
                <Icon name="email" size={theme.iconSize(3)} />
              </View>
              <View>
                <Text style={{ fontSize: 16, lineHeight: 22 }}>Manage Email</Text>
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple
            rippleColor="rgba(0,0,0,0.28)"
            onPress={() => navigation.navigate('PlaybackSettings')}
          >
            <View style={{ ...styles.settingItem, padding: theme.spacing(2) }}>
              <View style={styles.iconContainer}>
                <Icon name="video-quality" size={theme.iconSize(3)} />
              </View>
              <View>
                <Text style={{ fontSize: 16, lineHeight: 22 }}>Playback</Text>
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple>
            <View style={{ ...styles.settingItem, padding: theme.spacing(2) }}>
              <View style={styles.iconContainer}>
                <Icon name="lock" size={theme.iconSize(3)} />
              </View>
              <View>
                <Text style={{ fontSize: 16, lineHeight: 22 }}>Parental Control</Text>
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple
            rippleColor="rgba(0,0,0,0.28)"
            onPress={() => navigation.navigate('NeedHelpScreen')}
          >
            <View style={{ ...styles.settingItem, padding: theme.spacing(2) }}>
              <View style={styles.iconContainer}>
                <Icon name="help" size={theme.iconSize(3)} />
              </View>
              <View>
                <Text style={{ fontSize: 16, lineHeight: 22 }}>Need Help?</Text>
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple rippleColor="rgba(0,0,0,0.28)" onPress={() => setOnSigningOut(true)}>
            <View style={{ ...styles.settingItem, padding: theme.spacing(2) }}>
              <View style={styles.iconContainer}>
                <Icon name="logout" size={theme.iconSize(3)} />
              </View>
              <View>
                <Text style={{ fontSize: 16, lineHeight: 22 }}>
                  {authIsFetching ? 'Processing...' : 'Logout'}
                </Text>
              </View>
            </View>
          </TouchableRipple>
        </View>
        <AlertModal
          variant="danger"
          message="Are you sure you want to Logout?"
          visible={onSigningOut}
          hideAction={handleHideOnSignOut}
          onCancel={handleHideOnSignOut}
          confirmText="Logout"
          confirmAction={signOutAction}
        />
        {/* </View> */}
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
        <SnackBar
          visible={showPasswordChangedModal}
          iconName="circular-check"
          iconColor="#13BD38"
          message="Password changed successfully,
              you can use it in your next login."
        />
      </View>
      <WalkThrougGuide
        visible={showWalkthroughGuide}
        hideModal={handleAccountGuideVisible}
        nextModal={handleAccountNextGuide}
        title="View your profile"
        content="Tap here to view and edit your profile."
        skip="Skip"
        skipValue="- 1 of 2"
        next="Next"
        topWidth={30}
        rightWidth={15}
        leftWidth={15}
        topValue={0.32}
        heightValue={152}
        topPosValue={-15}
        leftPadding={100}
        trianglePosition="flex-start"
        containerPosition="flex-start"
        topPadding={251}
        rotateArrow="180deg"
      />
      <WalkThrougGuide
        visible={showAccountStepTwo}
        disabled={true}
        nextModal={handleAccountStepTwo}
        title="Back to Home"
        content="Tap here to go back to Home."
        skipValue="2 of 2"
        next="Got it"
        bottomWidth={25}
        rightWidth={15}
        leftWidth={15}
        topValue={0.75}
        heightValue={152}
        bottomPosValue={-40}
        trianglePosition="center"
        containerPosition="flex-end"
        bottomPadding={90}
        rotateArrow="178deg"
      />
    </SafeAreaView>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <AccountScreen {...props} />
  </ScreenContainer>
);

AccountScreen.propTypes = {
  signOutAction: PropTypes.func,
  getProfileAction: PropTypes.func,
  profile: PropTypes.object
};

const actions = {
  resetAction: Creators.reset, // for testing
  getProfileAction: ProfileCreators.get,
  getProfileStartAction: ProfileCreators.start,
  signOutAction: Creators.signOut,
  changePasswordStartAction: PasswordActionCreators.changePasswordStart
};

const mapStateToProps = createStructuredSelector({
  authIsFetching: selectAuthIsFetching,
  profile: selectProfile,
  profileError: selectProfileError,
  authError: selectAuthError,
  userUpdated: selectUpdated,
  passwordUpdated: selectPasswordUpdated
});

const enhance = compose(connect(mapStateToProps, actions), withNotifRedirect);

export default enhance(Container);
