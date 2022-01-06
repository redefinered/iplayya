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
import { Creators } from 'modules/ducks/isports/isports.actions';
import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';
import { Creators as RadioCreators } from 'modules/ducks/iradio/iradio.actions';
import { Creators as NotificationCreators } from 'modules/ducks/notifications/notifications.actions';
import { Creators as NavCreators } from 'modules/ducks/nav/nav.actions';
import RNFetchBlob from 'rn-fetch-blob';
import { createStructuredSelector } from 'reselect';
import ItvPlayer from './isports-player.component';
import CurrentProgram from './isports-current-program.component';
import {
  selectError,
  selectIsFetching,
  selectChannel,
  selectPrograms,
  selectPaginator,
  // selectCurrentProgram,
  selectFavoritesListUpdated
} from 'modules/ducks/isports/isports.selectors';
import theme from 'common/theme';
import { ActivityIndicator } from 'react-native-paper';
import { generateDatesFromToday } from 'utils';
import withNotifRedirect from 'components/with-notif-redirect.component';

const dirs = RNFetchBlob.fs.dirs;
const TODAY = new Date().toISOString();

const ChannelDetailScreen = ({
  isFetching,
  route: {
    params: { channelId, selectedCategory }
  },
  channel,
  programs,
  paginator,
  getChannelAction,
  navigation,
  startAction,
  onNotifResetAction,
  favoritesListUpdated,
  setMusicNowPlaying,
  setRadioNowPlaying,
  setBottomTabsVisibleAction,
  getChannelsAction,
  getChannelsByCategoriesAction
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
  const [date, setDate] = React.useState(TODAY);

  const handleDateSelect = (dateId) => {
    /// generate dates
    let dates = generateDatesFromToday();

    /// convert date ids to string
    dates = dates.map(({ id, ...rest }) => ({ id: id.toString(), ...rest }));

    /// get the date's value
    const { value } = dates.find(({ id }) => id === dateId);

    /// convert the date's value to string
    const d = new Date(value).toISOString();

    setDate(d);
  };

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
      setRadioNowPlaying(null);
    }
  }, [paused]);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => getInitialData());

    /// clears the indicator that there is a new notification
    onNotifResetAction();

    /// set programs to start state when a user leaves this page
    const unsubscribeToRouteRemove = navigation.addListener('beforeRemove', () => {
      // hide bottom menu tabs
      setBottomTabsVisibleAction({ hideTabs: true });

      // fetch updated cache when going back to master screen
      if (selectedCategory) {
        if (selectedCategory !== 'all') {
          getChannelsByCategoriesAction({
            categories: [parseInt(selectedCategory)],
            ...Object.assign(paginator, { pageNumber: 1 })
          });
        } else {
          getChannelsAction(Object.assign(paginator, { pageNumber: 1 }));
        }
      }
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
    // let date = new Date(Date.now());
    // getProgramsByChannelAction({ channelId, date: date.toISOString() });
  };

  React.useEffect(() => {
    if (favoritesListUpdated) {
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

      // set source
      if (isMovieDownloaded) {
        setSource(`${dirs.DocumentDir}/${filename}`);
      } else {
        let sourceSplit = url.split(' ');
        setSource(`${sourceSplit[1]}?token=${token}`);
      }
    }
  }, [channel, isMovieDownloaded]);

  const handleTogglePlay = () => {
    setLoading(true);
    setPaused(!paused);
  };

  const handleNextChannel = (nextChannelId) => {
    if (!channel) return;

    // let date = new Date(Date.now());

    getChannelAction({ videoId: nextChannelId });
    // getProgramsByChannelAction({ channelId: nextChannelId, date: date.toISOString() });

    navigation.setParams({ channelId: nextChannelId });
  };

  const handlePreviousChannel = (previousChannelId) => {
    if (!channel) return;

    // let date = new Date(Date.now());

    getChannelAction({ videoId: previousChannelId });
    // getProgramsByChannelAction({ channelId: previousChannelId, date: date.toISOString() });

    navigation.setParams({ channelId: previousChannelId });
  };

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

  const renderProgramGuide = () => {
    if (isFetching)
      return (
        <View>
          <ActivityIndicator />
        </View>
      );

    return (
      <ProgramGuide
        date={date}
        programs={programs}
        handleDateSelect={handleDateSelect}
        channelId={channelId}
        channelName={channel.title}
        title="Program Guide"
        showSnackBar={handleShowSnackBar}
        setCurrentProgram={setCurrentProgram}
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
  <ScreenContainer withHeaderPush>
    <ChannelDetailScreen {...props} />
  </ScreenContainer>
);

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  channel: selectChannel,
  programs: selectPrograms,
  paginator: selectPaginator,
  // currentProgram: selectCurrentProgram,
  favoritesListUpdated: selectFavoritesListUpdated
});

const actions = {
  addToFavoritesAction: Creators.addToFavorites,
  startAction: Creators.start,
  getChannelAction: Creators.getChannel,
  getChannelsAction: Creators.getChannels,
  getChannelsByCategoriesAction: Creators.getChannelsByCategories,
  onNotifResetAction: NotificationCreators.onNotifReset,
  setMusicNowPlaying: MusicCreators.setNowPlaying,
  setRadioNowPlaying: RadioCreators.setNowPlaying,
  setBottomTabsVisibleAction: NavCreators.setBottomTabsVisible
};

const enhance = compose(connect(mapStateToProps, actions), withNotifRedirect);

export default enhance(Container);
