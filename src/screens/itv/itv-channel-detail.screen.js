/* eslint-disable react/prop-types */

import React from 'react';
import { View, StatusBar, Dimensions, InteractionManager } from 'react-native';
import ContentWrap from 'components/content-wrap.component';
import Icon from 'components/icon/icon.component';
import ScreenContainer from 'components/screen-container.component';
import ProgramGuide from 'components/program-guide/program-guide.component';
import SnackBar from 'components/snackbar/snackbar.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/itv/itv.actions';
import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';
import { Creators as NotificationCreators } from 'modules/ducks/notifications/notifications.actions';
import { Creators as NavCreators } from 'modules/ducks/nav/nav.actions';
import RNFetchBlob from 'rn-fetch-blob';
import { createStructuredSelector } from 'reselect';
import ItvPlayer from './itv-player.component';
import CurrentProgram from './itv-current-program.component';
import {
  selectError,
  selectIsFetching,
  selectChannel,
  selectPrograms,
  selectCurrentProgram,
  selectFavoritesListUpdated
} from 'modules/ducks/itv/itv.selectors';
import theme from 'common/theme';
import { ActivityIndicator } from 'react-native-paper';

const dirs = RNFetchBlob.fs.dirs;

const ItvChannelDetailScreen = ({
  isFetching,
  route: {
    params: { channelId }
  },
  channel,
  programs,
  getProgramsByChannelAction,
  getProgramsByChannelStartAction,
  getChannelAction,
  navigation,
  /// the program that is playing at this moment
  // currentProgram,
  startAction,
  onNotifResetAction,
  // addToFavoritesAction,
  favoritesListUpdated,
  setMusicNowPlaying,
  setBottomTabsVisibleAction
}) => {
  const [paused, setPaused] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isMovieDownloaded] = React.useState(false);
  const [source, setSource] = React.useState('');
  const [showSnackBar, setShowSnackBar] = React.useState(false);
  const [showFavSnackBar, setShowFavSnackBar] = React.useState(false);
  const [contentHeight, setContentHeight] = React.useState(null);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [currentProgram, setCurrentProgram] = React.useState(null);

  React.useEffect(() => {
    if (!programs.length) return;

    setCurrentProgram(programs[0]);
  }, [programs]);

  React.useEffect(() => {
    if (!channel) return;

    navigation.setParams({ channel });
  }, [channel]);

  /// hide status bar if fullscreen
  const renderStatusbar = () => {
    if (fullscreen) return <StatusBar hidden />;
  };

  /// hide header if fullscreen
  React.useEffect(() => {
    if (fullscreen) return navigation.setOptions({ headerShown: false });

    navigation.setOptions({ headerShown: true });
  }, [fullscreen]);

  /// stop music player when a video is played
  React.useEffect(() => {
    if (!paused) {
      setMusicNowPlaying(null);
    }
  }, [paused]);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => getInitialData());

    /// clears the indicator that there is a new notification
    onNotifResetAction();

    /// set programs to start state when a user leaves this page
    const unsubscribeToRouteRemove = navigation.addListener('beforeRemove', () => {
      /// reset programs to start state
      getProgramsByChannelStartAction();

      // hide bottom menu tabs
      setBottomTabsVisibleAction({ hideTabs: true });
    });

    return () => {
      /// this will set the channel to null so that when viewing a channel there is no UI flickering
      startAction();

      /// unsibscribe to navigation listener
      unsubscribeToRouteRemove;
    };
  }, []);

  const getInitialData = () => {
    // get channel detail
    getChannelAction({ videoId: channelId });

    /// get programs starting at current time and date
    let date = new Date(Date.now());
    getProgramsByChannelAction({ channelId, date: date.toISOString() });
  };

  React.useEffect(() => {
    if (favoritesListUpdated) {
      // getChannelAction({ videoId: channelId });
      handleShowFavSnackBar();
    }
  }, [favoritesListUpdated]);

  React.useEffect(() => {
    if (channel) navigation.setParams({ channel });
    if (channel) {
      const { token, url, title: channelName } = channel;
      const titlesplit = channelName.split(' ');
      const title = titlesplit.join('_');
      const filename = `${channelId}_${title}.m3u8`;

      // console.log({ filename });

      // set source
      if (isMovieDownloaded) {
        setSource(`${dirs.DocumentDir}/${filename}`);
        // setSource(`${dirs.DocumentDir}/112238_test112238.m3u8`);
      } else {
        let sourceSplit = url.split(' ');
        setSource(`${sourceSplit[1]}?token=${token}`);
      }
    }
    // console.log({ isMovieDownloaded });
  }, [channel, isMovieDownloaded]);

  // const isFavorite = false;

  const handleTogglePlay = () => {
    setLoading(true);
    setPaused(!paused);
  };

  // const handleFovoritePress = () => {
  //   if (channel.is_favorite) return;

  //   addToFavoritesAction(parseInt(channelId));
  // };

  const handleNextChannel = (nextChannelId) => {
    if (!channel) return;

    let date = new Date(Date.now());

    getChannelAction({ videoId: nextChannelId });
    getProgramsByChannelAction({ channelId: nextChannelId, date: date.toISOString() });

    navigation.setParams({ channelId: nextChannelId });
  };

  const handlePreviousChannel = (previousChannelId) => {
    if (!channel) return;

    let date = new Date(Date.now());

    getChannelAction({ videoId: previousChannelId });
    getProgramsByChannelAction({ channelId: previousChannelId, date: date.toISOString() });

    navigation.setParams({ channelId: previousChannelId });
  };

  // const renderPlayer = () => {
  //   if (source) {
  //     return (
  //       <ItvPlayer
  //         channel={channel}
  //         paused={paused}
  //         source={source}
  //         handleNextChannel={handleNextChannel}
  //         handlePreviousChannel={handlePreviousChannel}
  //         loading={loading}
  //         setLoading={setLoading}
  //         setPaused={setPaused}
  //         handleTogglePlay={handleTogglePlay}
  //         fullscreen={fullscreen}
  //         setFullscreen={setFullscreen}
  //       />
  //     );
  //   }
  // };

  const handleShowSnackBar = () => {
    setShowSnackBar(true);
  };

  const hideSnackBar = () => {
    setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (showSnackBar) hideSnackBar();
  }, [showSnackBar]);

  const handleShowFavSnackBar = () => {
    setShowFavSnackBar(true);
  };

  const hideFavSnackBar = () => {
    setTimeout(() => {
      setShowFavSnackBar(false);
    }, 3000);
  };

  // hide fav snackbar
  React.useEffect(() => {
    if (showFavSnackBar) hideFavSnackBar();
  }, [showFavSnackBar]);

  const handleDateSelect = React.useCallback((date) => {
    getProgramsByChannelAction({ channelId, date });
  }, []);

  const renderProgramGuide = () => {
    if (isFetching)
      return (
        <View>
          <ActivityIndicator />
        </View>
      );

    return (
      <ProgramGuide
        programs={programs}
        onDateSelect={handleDateSelect}
        channelId={channelId}
        channelName={channel.title}
        title="Program Guide"
        showSnackBar={handleShowSnackBar}
        contentHeight={contentHeight}
        screen={false}
        parentType="ITV"
      />
    );
  };

  const renderScreenContent = () => {
    if (!fullscreen) {
      if (isFetching || !channel)
        return (
          <View>
            <ActivityIndicator />
          </View>
        );

      return (
        <React.Fragment>
          <View>
            <ContentWrap
              onLayout={({ nativeEvent }) => setContentHeight(nativeEvent.layout.height)}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: theme.spacing(2)
                }}
              >
                <View style={{ flex: 11, flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      marginRight: 10,
                      backgroundColor: theme.iplayya.colors.white10,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon name="iplayya" size={theme.iconSize(4)} color="white" />
                  </View>
                  <CurrentProgram channel={channel} currentProgram={currentProgram} />
                </View>
              </View>
            </ContentWrap>
            {/* program guide */}

            {renderProgramGuide()}
          </View>

          <SnackBar
            visible={showSnackBar}
            message="We will remind you before the program start."
            iconName="notifications"
            iconColor={theme.iplayya.colors.vibrantpussy}
          />

          <SnackBar
            visible={showFavSnackBar}
            message="Channel has been added to Favorites list"
            iconName="heart-solid"
            iconColor={theme.iplayya.colors.vibrantpussy}
          />
        </React.Fragment>
      );
    }
  };

  const setFullScreenPlayerStyle = () => {
    if (fullscreen)
      return {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      };

    return {
      marginTop: fullscreen ? 0 : theme.spacing(2),
      marginBottom: fullscreen ? 0 : theme.spacing(2)
    };
  };

  const renderMediaPlayer = () => {
    if (!source)
      return (
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 211,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black'
          }}
        />
      );

    return (
      <ItvPlayer
        channel={channel}
        currentProgram={currentProgram}
        paused={paused}
        source={source}
        handleNextChannel={handleNextChannel}
        handlePreviousChannel={handlePreviousChannel}
        loading={loading}
        setLoading={setLoading}
        setPaused={setPaused}
        handleTogglePlay={handleTogglePlay}
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderStatusbar()}

      {/* Player */}
      <View style={{ ...setFullScreenPlayerStyle() }}>{renderMediaPlayer()}</View>

      {renderScreenContent()}
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush backgroundType="solid">
    <ItvChannelDetailScreen {...props} />
  </ScreenContainer>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  channel: selectChannel,
  programs: selectPrograms,
  currentProgram: selectCurrentProgram,
  favoritesListUpdated: selectFavoritesListUpdated
});

const actions = {
  addToFavoritesAction: Creators.addToFavorites,
  startAction: Creators.start,
  getChannelAction: Creators.getChannel,
  getProgramsByChannelAction: Creators.getProgramsByChannel,
  getProgramsByChannelStartAction: Creators.getProgramsByChannelStart,
  onNotifResetAction: NotificationCreators.onNotifReset,
  setMusicNowPlaying: MusicCreators.setNowPlaying,
  setBottomTabsVisibleAction: NavCreators.setBottomTabsVisible
};

const enhance = compose(connect(mapStateToProps, actions));

export default enhance(Container);
