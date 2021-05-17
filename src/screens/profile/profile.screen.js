/* eslint-disable react/prop-types */

import React from 'react';
import ContentWrap from 'components/content-wrap.component';
import {
  View,
  Image,
  ScrollView,
  Pressable,
  ImageBackground,
  Dimensions,
  PixelRatio,
  Platform,
  Modal
} from 'react-native';
import { Title, Text, withTheme, useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import LinearGradient from 'react-native-linear-gradient';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/profile/profile.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import {
  selectProfile,
  selectUpdated,
  selectError,
  selectIsFetching
} from 'modules/ducks/profile/profile.selectors';
import { createStructuredSelector } from 'reselect';
import SnackBar from 'components/snackbar/snackbar.component';
import AlertModal from 'components/alert-modal/alert-modal.component';
import { StyleSheet } from 'react-native';
import { headerHeight } from 'common/values';
import ImagePick from 'components/image-picker/image-picker.component';

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingBottom: 40,
    overflow: 'hidden'
  },
  settingItem: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  iconContainer: {
    width: 42,
    justifyContent: 'center'
  }
});

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const scale = SCREEN_WIDTH / 375;

function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS == 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

const profilePlaceholderUri = Image.resolveAssetSource(require('../../assets/Avatar_Eclipse.png'))
  .uri;

const ProfileScreen = ({
  startAction,
  profile,
  getProfileAction,
  enableSwipeAction,
  theme: {
    iplayya: { colors }
  },
  updated,
  error
}) => {
  const { name, username, ...otherFields } = profile;
  const [showSnackBar, setShowSnackbar] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [imageChange, setImageChange] = React.useState(profilePlaceholderUri);
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const theme = useTheme();

  const fields = [
    { key: 'email', icon: 'email' },
    { key: 'phone', icon: 'phone' },
    { key: 'birth_date', icon: 'birthday' },
    { key: 'gender', icon: 'account' }
  ];

  const setProfileImage = (value) => {
    if (typeof imageChange === 'undefined') {
      setImageChange(profilePlaceholderUri);
    } else {
      console.log('qwe', value);
      setImageChange(value);
    }
  };

  React.useEffect(() => {
    enableSwipeAction(false);
  }, []);

  const hideErrorModal = () => {
    setShowErrorModal(false);
  };

  React.useEffect(() => {
    if (error) return setShowErrorModal(true);
    setShowErrorModal(false);
  }, [error]);

  React.useEffect(() => {
    if (modalOpen) {
      setImageChange(profilePlaceholderUri);
    }
  }, [modalOpen]);

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 3000);
  };

  const hideModalCamera = () => {
    setModalOpen(false);
  };

  React.useEffect(() => {
    if (updated) {
      // show snackbar after update
      setShowSnackbar(true);

      // get updated profile
      getProfileAction();

      // reset state
      startAction();

      // hide snackbar in 3 seconds
      hideSnackBar();
    }
  }, [updated]);
  return (
    <LinearGradient style={{ flex: 1, flexBasis: 200 }} colors={['#2D1449', '#0D0637']}>
      <Modal
        visible={modalOpen}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}
        >
          <View
            style={{
              backgroundColor: theme.iplayya.colors.white100,
              width: SCREEN_WIDTH - 20,
              height: SCREEN_HEIGHT - 0.5 * SCREEN_HEIGHT,
              borderRadius: 30,
              justifyContent: 'center'
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: normalize(24),
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: 50,
                  color: theme.iplayya.colors.goodnight
                }}
              >
                Upload profile photo
              </Text>
            </View>
            <ImagePick setProfileImage={setProfileImage} hideModalCamera={hideModalCamera} />
            <View>
              <Pressable onPress={() => setModalOpen(false)}>
                <Text
                  style={{
                    fontSize: normalize(18),
                    textAlign: 'center',
                    color: theme.iplayya.colors.black70,
                    fontWeight: 'bold',
                    marginBottom: 30
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <ImageBackground
        blurRadius={50}
        source={{
          uri: imageChange
          /*require('assets/placeholder.jpg')*/
        }}
        style={{ paddingTop: headerHeight + 10, resizeMode: 'cover' }}
      >
        <View style={styles.headerContainer}>
          <View
            style={{
              marginBottom: 17
            }}
          >
            <Image
              source={{ uri: imageChange /*require('assets/placeholder.jpg')*/ }}
              style={{
                width: 140,
                height: 140,
                borderRadius: 140
                // resizeMode: 'contain'
              }}
            />
            <Pressable
              style={{
                position: 'absolute',
                left: 100,
                top: 105,
                width: 40,
                height: 40,
                backgroundColor: theme.iplayya.colors.white10,
                borderRadius: 100 / 2,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon name="camera" size={26} onPress={() => setModalOpen(true)} />
            </Pressable>
          </View>
          <Title
            style={{
              fontSize: normalize(24),
              lineHeight: 33,
              fontWeight: 'bold',
              marginBottom: 10
            }}
          >
            {name}
          </Title>
          {username.length > 0 ? (
            <Text
              style={{ fontSize: normalize(16), lineHeight: 22, color: colors.white80 }}
            >{`@${username}`}</Text>
          ) : null}
        </View>
        <View style={styles.bodyContainer}>
          <View style={{ backgroundColor: colors.vibrantpussy, alignItems: 'center', padding: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="iplayya" size={21} />
              <Text
                style={{
                  fontSize: normalize(24),
                  lineHeight: 23,
                  fontWeight: 'bold',
                  marginLeft: 10
                }}
              >
                20,580
              </Text>
            </View>
            <Text style={{ fontSize: normalize(14), lineHeight: 16, marginTop: 2 }}>
              Total iPlayya time earned
            </Text>
          </View>
        </View>
      </ImageBackground>
      <ScrollView>
        <ContentWrap style={{ paddingTop: 20 }}>
          {fields.map(({ key, icon }) => {
            return (
              <Pressable key={key} style={styles.settingItem}>
                <View style={styles.iconContainer}>
                  <Icon name={icon} size={24} />
                </View>
                <View>
                  <Text style={{ fontSize: normalize(16), lineHeight: 22 }}>
                    {otherFields[key] ? otherFields[key] : 'N/S'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ContentWrap>
      </ScrollView>
      <SnackBar visible={showSnackBar} message="Changes saved successfully" />
      {error && (
        <AlertModal
          visible={showErrorModal}
          message={error}
          confirmText="Retry"
          variant="danger"
          confirmAction={() => getProfileAction()}
          hideAction={() => hideErrorModal()}
        />
      )}
    </LinearGradient>
  );
};

const actions = {
  getProfileAction: Creators.get,
  startAction: Creators.start,
  enableSwipeAction: NavActionCreators.enableSwipe
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  profile: selectProfile,
  updated: selectUpdated
});

export default compose(withTheme, connect(mapStateToProps, actions))(ProfileScreen);
