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

const Home = ({ setBottomTabsVisibleAction, completedOnboarding }) => {
  const [showWelcomeDialog, setShowWelcomeDialog] = React.useState(false);
  React.useEffect(() => {
    // makes sure main tab navigation is always visible on application mount
    setBottomTabsVisibleAction(true);
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
      <HomeMenu />
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
  completedOnboarding: selectCompletedOnboarding
});

const actions = {
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible
};

export default compose(withHeaderPush(), connect(mapStateToProps, actions))(Home);
