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
import { selectCompletedOnboarding } from 'modules/ducks/user/user.selectors';
import { selectIsFetching } from 'modules/ducks/auth/auth.selectors';
import withLoader from 'components/with-loader.component';

const Home = ({ navigation, completedOnboarding, setBottomTabsVisibleAction }) => {
  const [showWelcomeDialog, setShowWelcomeDialog] = React.useState(false);

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

  return (
    <ContentWrap>
      <HomeMenu navigation={navigation} />
      <WelcomeDialog visible={showWelcomeDialog} onButtonPress={handleWelcomeHide} />
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

  /**
   * FIX BUG WHERE LOADER IS STUCK IN HOME SCREEN
   * AFTER A SUCCESSFUL LOGIN. THIS STARTED TO HAPPEN
   * WHEN I REMOVED CATEGORY_ALIAS IN MOVIES.GRAPHQL
   * DUE TO API UPDATE
   */
  isFetching: selectIsFetching
});

const actions = {
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible
};

export default compose(
  withHeaderPush({ backgroundType: 'image' }),
  connect(mapStateToProps, actions),
  withLoader
)(Home);
