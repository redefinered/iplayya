/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import ContentWrap from 'components/content-wrap.component';
import ScreenContainer from 'components/screen-container.component';
import HomeMenu from 'components/home-menu/home-menu.component';
import WelcomeDialog from 'components/welcome-dialog/welcome-dialog.component';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
// import { selectCompletedOnboarding } from 'modules/ducks/user/user.selectors';
import { selectError, selectIsFetching } from 'modules/ducks/movies/movies.selectors';
import { selectIsLoggedIn } from 'modules/ducks/auth/auth.selectors';
import withLoader from 'components/with-loader.component';
import { Creators } from 'modules/ducks/movies/movies.actions';
// import { Creators as MusicCreator } from 'modules/ducks/music/music.actions';
import AlertModal from 'components/alert-modal/alert-modal.component';
import { compose } from 'redux';
// import { selectOnboardingComplete } from 'modules/ducks/auth/auth.selectors';

import HomeGuide from 'components/walkthrough-guide/home-guide.component';

import NotifService from '../../../NotifService';
import { selectNotifications } from 'modules/ducks/itv/itv.selectors.js';

const Home = ({
  error,
  navigation,
  completedOnboarding,
  setBottomTabsVisibleAction,
  getMoviesStartAction,
  resetCategoryPaginatorAction,
  enableSwipeAction,

  isLoggedIn,
  notifications
}) => {
  const [showWelcomeDialog, setShowWelcomeDialog] = React.useState(false);
  const [showErrorModal, setShowErrorModal] = React.useState(true);
  const [showHomeGuide, setShowHomeGuide] = React.useState(false);

  const onRegister = ({ token }) => {
    // setRegisterToken(token);
    // setFcmRegistered(true);
    console.log({ token });
  };

  const onNotif = ({ title, message, data: { channelId } }) => {
    console.log({ title, message, channelId });
    console.log('should render notifications page after this');
    navigation.navigate('ChannelDetailScreen', { channelId });
  };

  const notif = new NotifService(onRegister, onNotif);

  /// schedule a notification when a new one is created in state
  React.useEffect(() => {
    /// do nothing if there are no notifications
    if (!notifications.length) return;

    // notif.localNotif();

    scheduleNotification(notifications);
  }, [notifications]);

  // eslint-disable-next-line no-unused-vars
  const scheduleNotification = (notifications) => {
    notif.getScheduledLocalNotifications((notifications) => console.log({ notifications }));

    const {
      id,
      channelId,
      active,
      program: { title: programTitle },
      time
    } = notifications[0];

    /// if the notification is deactivated, do nothing
    if (!active) return;

    let title = `${programTitle} is now showing`;
    let message = 'Watch it now before it is to late!';

    const newScheduledNotif = { id, channelId, title, message, date: new Date(time) };

    notif.scheduleNotif(newScheduledNotif);
  };

  /// when loggedout, cancel all notifications
  React.useEffect(() => {
    if (isLoggedIn) return;

    notif.cancelAll();
  }, [isLoggedIn]);

  React.useEffect(() => {
    getMoviesStartAction();
    enableSwipeAction(true);
  }, []);

  React.useEffect(() => {
    // makes sure main tab navigation is always visible on application mount
    setBottomTabsVisibleAction({ hideTabs: false });
  });

  React.useEffect(() => {
    if (completedOnboarding) {
      setShowWelcomeDialog(false);
    } else {
      setShowWelcomeDialog(true);
    }
  }, [completedOnboarding]);

  const handleWelcomeHide = () => {
    setShowWelcomeDialog(false);
  };

  const handleHomeGuideHide = () => {
    setShowHomeGuide(false);
  };

  React.useEffect(() => {
    if (error) {
      setShowErrorModal(true);
    } else {
      setShowErrorModal(false);
    }
  }, [error]);

  const handleHideErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleProfileErrorConfirmAction = () => {
    getMoviesStartAction();
    // getCategoriesAction();
    resetCategoryPaginatorAction();

    // hide error modal after retry
    setShowErrorModal(false);
  };

  return (
    <ContentWrap style={{ marginTop: 20 }}>
      <HomeMenu navigation={navigation} />
      <WelcomeDialog visible={showWelcomeDialog} onButtonPress={handleWelcomeHide} />
      <HomeGuide visible={showHomeGuide} onButtonTouch={handleHomeGuideHide} />

      {error && (
        <AlertModal
          variant="danger"
          message={error}
          visible={showErrorModal}
          hideAction={handleHideErrorModal}
          confirmText="Retry"
          confirmAction={handleProfileErrorConfirmAction}
        />
      )}
    </ContentWrap>
  );
};

const Container = (props) => (
  <ScreenContainer backgroundType="image" withHeaderPush>
    <Home {...props} />
  </ScreenContainer>
);

Home.propTypes = {
  currentUser: PropTypes.object,
  portalAddress: PropTypes.string,
  helloAction: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  isLoggedIn: selectIsLoggedIn,
  notifications: selectNotifications
});

const actions = {
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  getMoviesStartAction: Creators.getMoviesStart,
  resetCategoryPaginatorAction: Creators.resetCategoryPaginator,
  enableSwipeAction: NavActionCreators.enableSwipe
};

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
