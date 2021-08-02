/* eslint-disable no-unused-vars */
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
import { Creators as ItvCreators } from 'modules/ducks/itv/itv.actions';
// import { Creators as MusicCreator } from 'modules/ducks/music/music.actions';
import AlertModal from 'components/alert-modal/alert-modal.component';
import { compose } from 'redux';
// import { selectOnboardingComplete } from 'modules/ducks/auth/auth.selectors';

import HomeGuide from 'components/walkthrough-guide/home-guide.component';

// import NotifService from 'NotifService';
import { selectNotifications, selectSubscriptions } from 'modules/ducks/itv/itv.selectors.js';
// import moment from 'moment';

import { NOTIFICATION_STATUS } from 'common/values';

const Home = ({
  error,
  navigation,
  completedOnboarding,
  setBottomTabsVisibleAction,
  getMoviesStartAction,
  resetCategoryPaginatorAction,
  enableSwipeAction,

  isLoggedIn,
  notifications,
  subscriptions,

  createNotificationAction,

  /// a string which is the ID of a scheduled notification
  activateNotification,
  deactivateNotification,
  clearDeactivateKeyAction,
  clearActivateKeyAction
}) => {
  const [showWelcomeDialog, setShowWelcomeDialog] = React.useState(false);
  const [showErrorModal, setShowErrorModal] = React.useState(true);
  const [showHomeGuide, setShowHomeGuide] = React.useState(false);

  const onRegister = ({ token }) => {
    // setRegisterToken(token);
    // setFcmRegistered(true);
    console.log({ token });
  };

  // React.useEffect(() => {
  //   /// notifications are cleared on login so this will only navigate if
  //   // user did not logout recently
  //   if (notifications.length) navigation.navigate('NotificationsScreen');
  // }, [notifications]);

  const onNotif = ({ title, message, data: { channelId, program } }) => {
    console.log({ title, message, channelId });
    /// add a new notification before navigating to notifications screen
    createNotificationAction({
      title,
      message,
      channelId,
      program,
      createdAt: new Date(Date.now())
    });

    /// navigates to channel detail when a notification is clicked
    // might be change to go to notifications page
    navigation.navigate('NotificationsScreen', { channelId });

    /// create a notification to display in notifications screen
    const now = new Date(Date.now());
    // createNotificationAction({
    //   id,
    //   channelName,
    //   channelId,
    //   time,
    //   status: NOTIFICATION_STATUS.DELIVERED,
    //   createdAt: now.getTime(), /// create a timestamp which is equal to the time at the moment
    //   program: { title, ...otherProgramProps }
    // });
  };

  // const notif = new NotifService(onRegister, onNotif);

  /// schedule a notification when a new one is created in state
  React.useEffect(() => {
    /// do nothing if there are no notifications
    if (!subscriptions.length) return;

    // for development -- check active created notifications
    // notif.getScheduledLocalNotifications((notifications) => console.log({ notifications }));

    // scheduleNotification(notifications);
  }, [subscriptions]);

  // eslint-disable-next-line no-unused-vars
  // const scheduleNotification = (notifications) => {
  //   const {
  //     id,
  //     channelId,
  //     channelName,
  //     active,
  //     program: { title: programTitle, description },
  //     time
  //   } = notifications[0];

  //   /// if the notification is deactivated, do nothing
  //   if (!active) return;

  //   let title = `${programTitle} will start in 5 mins`;

  //   const date = new Date(time);

  //   const newScheduledNotif = {
  //     id,
  //     channelId,
  //     channelName,
  //     title,
  //     message: description,
  //     date: moment(date).subtract(5, 'minutes')
  //   };

  //   notif.scheduleNotif(newScheduledNotif);
  // };

  /// when loggedout, cancel all notifications
  // React.useEffect(() => {
  //   if (isLoggedIn) return;

  //   notif.cancelAll();
  // }, [isLoggedIn]);

  React.useEffect(() => {
    getMoviesStartAction();
    enableSwipeAction(true);

    // makes sure main tab navigation is always visible on application mount
    setBottomTabsVisibleAction({ hideTabs: false });
  }, []);

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
  notifications: selectNotifications,
  subscriptions: selectSubscriptions
});

const actions = {
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  getMoviesStartAction: Creators.getMoviesStart,
  resetCategoryPaginatorAction: Creators.resetCategoryPaginator,
  enableSwipeAction: NavActionCreators.enableSwipe,

  /// action to create a notification to display to notifications screen
  createNotificationAction: ItvCreators.createNotification,
  clearDeactivateKeyAction: ItvCreators.clearDeactivateKey
};

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
