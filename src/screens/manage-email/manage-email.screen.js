/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import ContentWrap from 'components/content-wrap.component';
import ScreenContainer from 'components/screen-container.component';
import { useTheme, Text, TouchableRipple } from 'react-native-paper';
import { View, SafeAreaView, InteractionManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as ProfileCreators } from 'modules/ducks/profile/profile.actions';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { selectProfile, selectUpdated } from 'modules/ducks/profile/profile.selectors';
import { selectIsFetching as selectAuthIsFetching } from 'modules/ducks/auth/auth.selectors';
// import { selectUpdated } from 'modules/ducks/user/user.selectors';

import SnackBar from 'components/snackbar/snackbar.component';
import Icon from 'components/icon/icon.component';

const ManageEmailScreen = ({
  profile,
  currentUserId,
  userUpdated,
  getProfileAction,
  enableSwipeAction,
  startAction
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [showSnackBar, setShowSnackbar] = React.useState(false);

  React.useEffect(() => {
    if (!profile) {
      getProfileAction();
      return;
    }
    // fixes an issue where previous user profile is being loaded from cache
    if (currentUserId === profile.id) return;
    getProfileAction();
  }, [currentUserId, profile]);

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 3000);
  };

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (userUpdated) {
        // show snackbar after update
        setShowSnackbar(true);

        getProfileAction();
        // reset state
        startAction();
        // hide snackbar in 3 seconds
        hideSnackBar();
      }
    });
  }, [userUpdated]);

  React.useEffect(() => {
    enableSwipeAction(false);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 20 }}>
      <ContentWrap>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            lineHeight: 22,
            paddingBottom: 20,
            marginLeft: 5
          }}
        >
          Account Emails
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 12,
            lineHeight: 19,
            marginBottom: 8,
            paddingRight: 15,
            color: 'rgba(255, 255, 255, 0.5)'
          }}
        >
          Primary Email
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'relative',
            paddingBottom: 10
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{profile.email}</Text>
          <View>
            <TouchableRipple
              onPress={() => navigation.navigate('ChangeEmailScreen')}
              borderless={true}
              style={{ position: 'absolute', right: 0, bottom: 4, borderRadius: 12 }}
              rippleColor="rgba(0,0,0,0.28)"
            >
              <View style={{ padding: 4 }}>
                <Icon name="edit" size={theme.iconSize(3)} />
              </View>
            </TouchableRipple>
          </View>
        </View>
      </ContentWrap>
      <View style={{ padding: theme.spacing(2) }} />
      {/* <View>
        <TouchableRipple
          rippleColor="rgba(0,0,0,0.28)"
          onPress={() => alert('You tapped the button!')}
        >
          <View style={{ flexDirection: 'row', padding: theme.spacing(2), marginLeft: 22 }}>
            <Icon name="add" size={theme.iconSize(3)} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                marginLeft: 20
              }}
            >
              Add alternative email
            </Text>
          </View>
        </TouchableRipple>
      </View> */}
      <SnackBar
        visible={showSnackBar}
        iconName="circular-check"
        iconColor="#13BD38"
        message="To activate, a link was sent to your new email to verify your account."
      />
    </SafeAreaView>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <ManageEmailScreen {...props} />
  </ScreenContainer>
);

ManageEmailScreen.propTypes = {
  getProfileAction: PropTypes.func,
  profile: PropTypes.object
};

const actions = {
  getProfileAction: ProfileCreators.get,
  enableSwipeAction: NavActionCreators.enableSwipe,
  startAction: ProfileCreators.start
};

const mapStateToProps = createStructuredSelector({
  authIsFetching: selectAuthIsFetching,
  profile: selectProfile,
  userUpdated: selectUpdated
});

export default connect(mapStateToProps, actions)(Container);
