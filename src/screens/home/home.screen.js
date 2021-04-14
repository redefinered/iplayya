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
import { Creators } from 'modules/ducks/movies/movies.actions';
import RNBackgroundDownloader from 'react-native-background-downloader';
import theme from 'common/theme';

const Home = ({
  navigation,
  completedOnboarding,
  setBottomTabsVisibleAction,
  getCategoriesAction,
  getMoviesStartAction
}) => {
  const [showWelcomeDialog, setShowWelcomeDialog] = React.useState(false);

  /// load categories here
  React.useEffect(() => {
    getMoviesStartAction();
    getCategoriesAction();

    // downloadtest();

    console.log({ path: `${RNBackgroundDownloader.directories.documents}/12YearsASlave.mp4` });
  }, []);

  const downloadtest = () => {
    console.log('testing donwload');
    let task = RNBackgroundDownloader.download({
      id: 'file123',
      url: 'http://vod3.freeddns.org:80/195181164146/12YearsASlave.mp4',
      // url:
      //   'https://firebasestorage.googleapis.com/v0/b/iplayya.appspot.com/o/12AngryMen.mp4?alt=media&token=e5fbea09-e383-4fbb-85bd-206bceb4ef4d',
      destination: `${RNBackgroundDownloader.directories.documents}/12YearsASlave.mp4`
    })
      .begin((expectedBytes) => {
        console.log(`Going to download ${expectedBytes} bytes!`);
      })
      .progress((percent) => {
        console.log(`Downloaded: ${percent * 100}%`);
      })
      .done(() => {
        console.log('Download is done!');
      })
      .error((error) => {
        console.log('Download canceled due to error: ', error);
      });

    // Pause the task
    // task.pause();

    // Resume after pause
    // task.resume();

    // Cancel the task
    // task.stop();
  };

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
  setBottomTabsVisibleAction: NavActionCreators.setBottomTabsVisible,
  getCategoriesAction: Creators.getCategories,
  getMoviesStartAction: Creators.getMoviesStart
};

export default compose(
  withHeaderPush({ backgroundType: 'image' }),
  connect(mapStateToProps, actions),
  withLoader
)(Home);
