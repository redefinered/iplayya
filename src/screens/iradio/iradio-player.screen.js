/* eslint-disable react/prop-types */

import React from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import ContentWrap from 'components/content-wrap.component';
import { createFontFormat } from 'utils';
import SnackBar from 'components/snackbar/snackbar.component';
import withLoader from 'components/with-loader.component';
import PrevButton from 'components/button-prev/prev-button.component';
import NextButton from 'components/button-next/next-button.component';
import PlayButton from 'components/button-play/play-button.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/iradio/iradio.actions';
import { Creators as FavoritesCreators } from 'modules/ducks/iradio-favorites/iradio-favorites.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectNowPlaying,
  selectPaused,
  selectPlaybackProgress,
  selectRadioStations
} from 'modules/ducks/iradio/iradio.selectors';
import {
  selectIsFetching,
  selectAdded
} from 'modules/ducks/iradio-favorites/iradio-favorites.selectors';
import theme from 'common/theme';

const coverplaceholder = require('assets/imusic-placeholder.png');

const IradioPlayerScreen = ({
  //   navigation,
  nowPlaying,
  // progress,
  paused,
  setPausedAction,
  added,
  favoritesStartAction,
  getRadiosAction,
  radioStations,
  setNowPlayingAction
}) => {
  const [disablePrevious, setDisablePrevious] = React.useState(true);
  const [disableNext, setDisableNext] = React.useState(false);
  const [showUpdateNotification, setShowUpdateNotification] = React.useState(false);

  React.useEffect(() => {
    updateButtons(nowPlaying);
  }, [nowPlaying]);

  const updateButtons = (nowPlaying) => {
    if (nowPlaying) {
      const { number } = nowPlaying;
      const nextStation = number + 1;
      const previousStation = number - 1;
      const totalStations = radioStations.length;

      setDisableNext(false);
      setDisablePrevious(false);

      if (nextStation > totalStations) {
        setDisableNext(true);
      }

      if (previousStation < 1) {
        setDisablePrevious(true);
      }
    }
  };

  const playNext = () => {
    const nextStationNumber = nowPlaying.number + 1;

    if (nextStationNumber > radioStations.length) {
      setDisablePrevious(false);

      setPausedAction(true);

      return;
    }

    const nextStation = radioStations.find(({ number }) => nextStationNumber === parseInt(number));

    const { number, name: title, cmd, ...rest } = nextStation;
    setNowPlayingAction({
      number: parseInt(number),
      title,
      url: cmd,
      ...rest
    });
  };

  const playPrevious = () => {
    const nextStationNumber = nowPlaying.number - 1;

    if (nextStationNumber <= 0) {
      setPausedAction(true);

      return;
    }

    const nextStation = radioStations.find(({ number }) => nextStationNumber === parseInt(number));

    const { number, name: title, cmd, ...rest } = nextStation;
    setNowPlayingAction(
      {
        number: parseInt(number),
        title,
        url: cmd,
        ...rest
      },
      false
    );
  };

  /// show update notification
  React.useEffect(() => {
    if (added) {
      setShowUpdateNotification(true);
      getRadiosAction({ pageNumber: 1, limit: 10, orderBy: 'number', order: 'asc' });
    }
  }, [added]);

  /// hide update notification when it displays
  React.useEffect(() => {
    if (showUpdateNotification) {
      hideUpdateNotification();
    }
  }, [showUpdateNotification]);

  const hideUpdateNotification = () => {
    /// reset updated check
    favoritesStartAction();

    setTimeout(() => {
      setShowUpdateNotification(false);
    }, 3000);
  };

  const handleTogglePlayAction = () => {
    setPausedAction(!paused);
  };

  const renderUpdateNotification = () => {
    if (!nowPlaying) return;
    // ${track.name}
    return (
      <SnackBar
        visible={showUpdateNotification}
        message={`${nowPlaying.title} is added to your favorites list`}
        iconName="heart-solid"
        iconColor={theme.iplayya.colors.vibrantpussy}
      />
    );
  };

  if (nowPlaying) {
    const { title } = nowPlaying;
    return (
      <ContentWrap>
        <View style={{ alignItems: 'center', paddingTop: 70, marginBottom: 30 }}>
          <Image style={{ width: 220, height: 220, borderRadius: 8 }} source={coverplaceholder} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ marginBottom: 30 }}>
            <Text
              numberOfLines={2}
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: 15,
                textTransform: 'capitalize',
                ...createFontFormat(20, 27)
              }}
            >
              {title}
            </Text>
          </View>
        </View>

        {/* <MediaProgressVisualizer /> */}

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <PrevButton pressAction={playPrevious} disabled={disablePrevious} />
          <PlayButton paused={paused} pressAction={handleTogglePlayAction} />
          <NextButton pressAction={playNext} disabled={disableNext} />
        </View>

        {renderUpdateNotification()}
      </ContentWrap>
    );
  }

  return <View />;
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <IradioPlayerScreen {...props} />
  </ScreenContainer>
);

const actions = {
  setNowPlayingAction: Creators.setNowPlaying,
  setProgressAction: Creators.setProgress,
  getRadiosAction: Creators.get,
  updatePlaybackInfoAction: Creators.updatePlaybackInfo,
  setPausedAction: Creators.setPaused,
  favoritesStartAction: FavoritesCreators.start,
  getFavoritesAction: FavoritesCreators.getFavorites,
  addToFavoritesAction: FavoritesCreators.addToFavorites
};

const mapStateToProps = createStructuredSelector({
  paused: selectPaused,
  nowPlaying: selectNowPlaying,
  progress: selectPlaybackProgress,
  radioStations: selectRadioStations,
  isAddingToFavorites: selectIsFetching,
  added: selectAdded
});

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
