/* eslint-disable react/prop-types */

import React from 'react';
import ContentWrap from 'components/content-wrap.component';
import { View, Image, ScrollView, Pressable, ImageBackground } from 'react-native';
import { Title, Text, withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import LinearGradient from 'react-native-linear-gradient';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/profile/profile.actions';
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

const styles = StyleSheet.create({
  headerContainer: { alignItems: 'center', paddingBottom: 40, overflow: 'hidden' },
  settingItem: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  iconContainer: {
    width: 42,
    justifyContent: 'center'
  }
});

const ProfileScreen = ({
  startAction,
  profile,
  getProfileAction,
  theme: {
    iplayya: { colors }
  },
  updated,
  error
}) => {
  const { name, username, ...otherFields } = profile;
  const [showSnackBar, setShowSnackbar] = React.useState(false);

  const fields = [
    { key: 'email', icon: 'email' },
    { key: 'phone', icon: 'phone' },
    { key: 'birth_date', icon: 'birthday' },
    { key: 'gender', icon: 'account' }
  ];

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 3000);
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
    <LinearGradient style={{ flex: 1 }} colors={['#2D1449', '#0D0637']}>
      <ImageBackground
        blurRadius={50}
        source={require('images/placeholder.jpg')}
        style={{ paddingTop: headerHeight + 10 }}
      >
        <View style={styles.headerContainer}>
          <View style={{ width: 140, marginBottom: 17 }}>
            <Image
              source={require('images/placeholder.jpg')}
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                resizeMode: 'contain'
              }}
            />
          </View>
          <Title style={{ fontSize: 24, lineHeight: 33, fontWeight: 'bold', marginBottom: 10 }}>
            {name}
          </Title>
          {username.length > 0 ? (
            <Text
              style={{ fontSize: 16, lineHeight: 22, color: colors.white80 }}
            >{`@${username}`}</Text>
          ) : null}
        </View>
        <View style={styles.bodyContainer}>
          <View style={{ backgroundColor: colors.vibrantpussy, alignItems: 'center', padding: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="iplayya" size={21} />
              <Text style={{ fontSize: 24, lineHeight: 33, fontWeight: 'bold', marginLeft: 10 }}>
                20,580
              </Text>
            </View>
            <Text style={{ fontSize: 12, lineHeight: 16 }}>Total iPlayya time earned</Text>
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
                  <Text style={{ fontSize: 16, lineHeight: 22 }}>
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
          visible={error ? true : false}
          message={error}
          confirmText="Retry"
          variant="danger"
          confirmAction={() => getProfileAction()}
        />
      )}
    </LinearGradient>
  );
};

const actions = {
  getProfileAction: Creators.get,
  startAction: Creators.start
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  profile: selectProfile,
  updated: selectUpdated
});

export default compose(withTheme, connect(mapStateToProps, actions))(ProfileScreen);
