/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import ContentWrap from 'components/content-wrap.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';

import HomeMenu from 'components/home-menu/home-menu.component';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators as NavActionCreators } from 'modules/ducks/nav/nav.actions';

const Home = ({ setBottomTabsVisibleAction }) => {
  React.useEffect(() => {
    // makes sure main tab navigation is always visible on application mount
    setBottomTabsVisibleAction(true);
  });

  return (
    <ContentWrap>
      <HomeMenu />
    </ContentWrap>
  );
};

Home.propTypes = {
  currentUser: PropTypes.object,
  portalAddress: PropTypes.string,
  helloAction: PropTypes.func
};

const actions = {
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible
};

export default compose(withHeaderPush(), connect(null, actions))(Home);
