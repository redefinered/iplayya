/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import ContentWrap from 'components/content-wrap.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import HomeMenu from 'components/home-menu/home-menu.component';
import WelcomeDialog from 'components/welcome-dialog/welcome-dialog.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';
import { Creators as AuthActionCreators } from 'modules/ducks/auth/auth.actions';
import { selectCompletedOnboarding } from 'modules/ducks/user/user.selectors';
import { selectIsFetching } from 'modules/ducks/movies/movies.selectors';
import { Creators } from 'modules/ducks/movies/movies.actions';
import AlertModal from 'components/alert-modal/alert-modal.component';
import { selectError } from 'modules/ducks/movies/movies.selectors';
import NetInfo from '@react-native-community/netinfo';

const Home = ({
  error,
  navigation,
  completedOnboarding,
  setBottomTabsVisibleAction,
  getCategoriesAction,
  getMoviesStartAction,
  resetCategoryPaginatorAction,
  setNetworkInfoAction
}) => {
  const [showWelcomeDialog, setShowWelcomeDialog] = React.useState(false);
  const [showErrorModal, setShowErrorModal] = React.useState(true);

  /// load categories here
  React.useEffect(() => {
    getMoviesStartAction();
    getCategoriesAction();
    resetCategoryPaginatorAction();

    // Subscribe
    const unsubscribe = NetInfo.addEventListener(({ type, isConnected }) => {
      // console.log('Connection type', type);
      // console.log('Is connected?', isConnected);

      setNetworkInfoAction({ type, isConnected });
    });

    // Unsubscribe
    unsubscribe();
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

Home.propTypes = {
  currentUser: PropTypes.object,
  portalAddress: PropTypes.string,
  helloAction: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  completedOnboarding: selectCompletedOnboarding,
  error: selectError,

  /**
   * FIX BUG WHERE LOADER IS STUCK IN HOME SCREEN
   * AFTER A SUCCESSFUL LOGIN. THIS STARTED TO HAPPEN
   * WHEN I REMOVED CATEGORY_ALIAS IN MOVIES.GRAPHQL
   * DUE TO API UPDATE
   */
  isFetching: selectIsFetching
});

const actions = {
  setNetworkInfoAction: AuthActionCreators.setNetworkInfo,
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  getCategoriesAction: Creators.getCategories,
  getMoviesStartAction: Creators.getMoviesStart,
  resetCategoryPaginatorAction: Creators.resetCategoryPaginator
};

const enhance = compose(
  connect(mapStateToProps, actions),
  withHeaderPush({ backgroundType: 'image', withLoader: true })
);

export default enhance(Home);
