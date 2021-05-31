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
import { selectCompletedOnboarding } from 'modules/ducks/user/user.selectors';
import { selectIsFetching } from 'modules/ducks/movies/movies.selectors';
import withLoader from 'components/with-loader.component';
import { Creators } from 'modules/ducks/movies/movies.actions';
import AlertModal from 'components/alert-modal/alert-modal.component';
import { selectError } from 'modules/ducks/movies/movies.selectors';
import { compose } from 'redux';
import { CastButton, useRemoteMediaClient } from 'react-native-google-cast';

// import { View } from 'react-native';

const Home = ({
  error,
  navigation,
  completedOnboarding,
  setBottomTabsVisibleAction,
  getCategoriesAction,
  getMoviesStartAction,
  resetCategoryPaginatorAction,
  enableSwipeAction
}) => {
  const [showWelcomeDialog, setShowWelcomeDialog] = React.useState(false);
  const [showErrorModal, setShowErrorModal] = React.useState(true);

  // this will automatically rerender when client is connected
  const client = useRemoteMediaClient();

  if (client) {
    client.loadMedia({
      mediaInfo: {
        contentUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/BigBuckBunny.mp4',
        contentType: 'video/mp4',
        metadata: {
          images: [
            {
              url:
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/images/480x270/BigBuckBunny.jpg'
            }
          ],
          title: 'Big Buck Bunny',
          subtitle:
            'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.',
          studio: 'Blender Foundation',
          type: 'movie'
        },
        streamDuration: 596 // seconds
      },
      startTime: 10 // seconds
    });
  }

  /// load categories here
  React.useEffect(() => {
    getMoviesStartAction();
    getCategoriesAction();
    resetCategoryPaginatorAction();
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
    getCategoriesAction();
    resetCategoryPaginatorAction();

    // hide error modal after retry
    setShowErrorModal(false);
  };

  return (
    <ContentWrap style={{ marginTop: 30 }}>
      <HomeMenu navigation={navigation} />
      <CastButton style={{ width: 24, height: 24 }} tintColor="red" />
      {/* <View style={{ width: 24, height: 24, backgroundColor: 'red' }} /> */}
      <WelcomeDialog visible={showWelcomeDialog} onButtonPress={handleWelcomeHide} />
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
  <ScreenContainer withHeaderPush>
    <Home {...props} />
  </ScreenContainer>
);

Home.propTypes = {
  currentUser: PropTypes.object,
  portalAddress: PropTypes.string,
  helloAction: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  completedOnboarding: selectCompletedOnboarding,
  error: selectError,

  isFetching: selectIsFetching
});

const actions = {
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  getCategoriesAction: Creators.getCategories,
  getMoviesStartAction: Creators.getMoviesStart,
  resetCategoryPaginatorAction: Creators.resetCategoryPaginator,
  enableSwipeAction: NavActionCreators.enableSwipe
};

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
