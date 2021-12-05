/* eslint-disable react/prop-types */

import React from 'react';
import {
  View,
  ScrollView,
  Platform,
  Modal,
  StatusBar,
  Dimensions,
  InteractionManager
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import MediaPlayer from 'components/media-player/media-player.component';
import { Text, List } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/movies/movies.actions';
import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';
import { Creators as DownloadsCreators } from 'modules/ducks/imovie-downloads/imovie-downloads.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectMovie,
  selectPlaybackInfo,
  selectUpdatedFavoritesCheck,
  selectUrlForVodPlayer,
  selectMovieVideoUrls
} from 'modules/ducks/movies/movies.selectors';
import {
  selectIsFetching as selectDownloading,
  selectDownloadStarted
} from 'modules/ducks/imovie-downloads/imovie-downloads.selectors';
import { selectPlaybackSettings } from 'modules/ducks/user/user.selectors';
import RNFetchBlob from 'rn-fetch-blob';
import { downloadPath, createFontFormat, toDateTime, toTitleCase } from 'utils';
import SnackBar from 'components/snackbar/snackbar.component';
// import { useRemoteMediaClient } from 'react-native-google-cast';
import { MODULE_TYPES } from 'common/globals';
import moment from 'moment';
import theme from 'common/theme';
import withNotifRedirect from 'components/with-notif-redirect.component';

const MovieDetailScreen = ({
  error,
  route: {
    params: { videoId }
  },
  movie,
  videoSource,
  playbackStartAction,
  getMovieAction,
  getMovieStartAction,
  isFavListUpdated,
  getFavoriteMoviesAction,
  addMovieToFavoritesStartAction,
  downloadsIsFetching,
  downloadStartAction,
  downloadStarted,
  videoUrls,
  setMusicNowPlaying,
  navigation,

  playbackSettings
}) => {
  const [paused, setPaused] = React.useState(false);
  const [isMovieDownloaded, setIsMoviedownloaded] = React.useState(false);
  const [source, setSource] = React.useState('');
  const [downloadedFiles, setDownloadedFiles] = React.useState([]);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [showFavoriteSnackBar, setShowFavoriteSnackBar] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);

  React.useEffect(() => {
    if (!movie) return;

    navigation.setParams({ movie });
  }, [movie]);

  const renderStatusbar = () => {
    if (fullscreen) return <StatusBar hidden />;
  };

  React.useEffect(() => {
    if (fullscreen) return navigation.setOptions({ headerShown: false });

    navigation.setOptions({ headerShown: true });
  }, [fullscreen]);

  React.useEffect(() => {
    if (playbackSettings.is_autoplay_video === false) {
      setPaused(true);
    }
  }, [playbackSettings.is_autoplay_video]);

  /// stop music player when a video is played
  React.useEffect(() => {
    if (!paused) {
      setMusicNowPlaying(null);
    }
  }, [paused]);

  React.useEffect(() => {
    // get downloads
    listDownloadedFiles();

    // set start state for downloads screen
    downloadStartAction();

    // set start state for playback
    playbackStartAction();

    // set movie add to favorites state
    addMovieToFavoritesStartAction();

    InteractionManager.runAfterInteractions(() => {
      // get movie data
      getMovieAction(videoId);
    });

    const navListener = navigation.addListener('beforeRemove', () => {
      getMovieStartAction();
    });

    return () => navListener;
  }, []);

  React.useEffect(() => {
    if (showSnackbar) {
      hideSnackbar();
    }
    if (showFavoriteSnackBar) {
      hideSnackbar();
    }
  }, [showSnackbar, showFavoriteSnackBar]);

  React.useEffect(() => {
    if (downloadStarted) {
      setShowSnackbar(true);
    } else {
      setShowSnackbar(false);
    }
  }, [downloadStarted]);

  const handleSourceSet = (src) => {
    setSource(src);
  };

  const hideSnackbar = () => {
    setTimeout(() => {
      setShowSnackbar(false);
      setShowFavoriteSnackBar(false);
    }, 3000);
  };

  const listDownloadedFiles = async () => {
    const ls = await RNFetchBlob.fs.ls(downloadPath);
    setDownloadedFiles(ls);
  };

  React.useEffect(() => {
    if (movie) navigation.setParams({ movie });
    if (movie) {
      const titlesplit = movie.title.split(' ');
      const title = titlesplit.join('_');
      const filename = `${videoId}_${title}.mp4`;
      const file = downloadedFiles.find((file) => file === filename);

      // check if downloaded
      if (downloadedFiles.length) {
        if (typeof file !== 'undefined') {
          setIsMoviedownloaded(true);
        } else {
          setIsMoviedownloaded(false);
        }
      }
    }
  }, [movie, downloadedFiles]);

  React.useEffect(() => {
    if (movie) {
      const { is_series } = movie;
      let videoUrl = '';

      // initial video source
      if (is_series) {
        /// for testing
        videoUrl = 'http://84.17.37.2/boxoffice/1080p/GodzillaVsKong-2021-1080p.mp4/index.m3u8';
      } else {
        videoUrl = videoSource;
      }

      const { title: movieTitle } = movie;
      const titlesplit = movieTitle.split(' ');
      const title = titlesplit.join('_');
      const filename = `${videoId}_${title}.mp4`;

      // set source
      if (isMovieDownloaded) {
        let src =
          Platform.OS === 'ios'
            ? `file://${downloadPath}/${filename}`
            : `${downloadPath}/${filename}`;
        setSource(src); /// file:// teqnique only works on iOS
      } else {
        // let src = videoUrl;
        // let setsrc = src === '' ? null : src;
        setSource(videoUrl);
      }
    }
  }, [movie, isMovieDownloaded]);

  // execute getFavorites if favorites list is updated
  React.useEffect(() => {
    if (isFavListUpdated) {
      getFavoriteMoviesAction();
      setShowFavoriteSnackBar(true);
    }
  }, [isFavListUpdated]);

  const handleTogglePlay = () => {
    setPaused(!paused);
  };

  if (error)
    return (
      <ContentWrap>
        <Text>{error}</Text>
      </ContentWrap>
    );

  if (!movie) return <View />;
  // return (
  //   <ContentWrap>
  //     <Text>Working...</Text>
  //   </ContentWrap>
  // );

  const {
    /// items to exclude in 'read more' section
    // eslint-disable-next-line no-unused-vars
    id,
    // eslint-disable-next-line no-unused-vars
    __typename,
    // eslint-disable-next-line no-unused-vars
    video_urls,
    // eslint-disable-next-line no-unused-vars
    is_hd,
    // eslint-disable-next-line no-unused-vars
    is_censored,
    // eslint-disable-next-line no-unused-vars
    is_favorite,
    // eslint-disable-next-line no-unused-vars
    series,

    title,
    year,
    description,
    rating_mpaa,
    category,
    director,
    thumbnail,
    is_series,
    ...otherFields
  } = movie;

  const readMoreData = Object.keys(otherFields).map((key) => {
    if (key === 'time') {
      const timeToDate = toDateTime(otherFields.time * 60);

      return {
        key,
        label: 'Duration',
        value: `${moment(timeToDate).format('H')}hr ${moment(timeToDate).format('mm')}m`
      };
    }

    if (key === 'country') {
      return {
        key,
        label: 'Country of origin',
        value: otherFields[key]
      };
    }

    if (key === 'rating_imdb') {
      return {
        key,
        label: toTitleCase(key.replace('_', ' ')),
        value: parseFloat(otherFields[key]).toFixed(2)
      };
    }

    if (key === 'rating_kinopoisk') {
      return {
        key,
        label: toTitleCase(key.replace('_', ' ')),
        value: parseFloat(otherFields[key]).toFixed(2)
      };
    }

    return {
      key,
      label: toTitleCase(key.replace('_', ' ')),
      value: otherFields[key]
    };
  });

  // const playTrailer = () => {
  //   console.log('playing trailer');
  // };

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
      <MediaPlayer
        qualitySwitchable={true}
        isSeries={is_series}
        paused={paused}
        source={source}
        thumbnail={thumbnail}
        title={title}
        videoLength={movie.time}
        togglePlay={handleTogglePlay}
        setPaused={setPaused}
        setSource={handleSourceSet}
        videoUrls={videoUrls}
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
        moduleType={MODULE_TYPES.VOD}
      />
    );
  };

  const renderVideoCaption = () => {
    if (!fullscreen)
      return (
        <ContentWrap>
          <Text
            style={{
              ...createFontFormat(12, 16),
              color: theme.iplayya.colors.white50
            }}
          >{`${year}, 1h 55m | ${rating_mpaa}. ${category}`}</Text>
        </ContentWrap>
      );
  };

  const renderScreenContent = () => {
    if (!fullscreen)
      return (
        <React.Fragment>
          <ScrollView>
            <ContentWrap>
              <Text
                style={{ ...createFontFormat(24, 33), paddingVertical: 15 }}
              >{`${title} (${year})`}</Text>
              <Text numberOfLines={3} style={{ ...createFontFormat(14, 20), marginBottom: 15 }}>
                {description}
              </Text>
              <Text style={{ ...createFontFormat(14, 20), marginBottom: 15 }}>
                <Text style={{ color: theme.iplayya.colors.white50, ...createFontFormat(14, 20) }}>
                  Director{' '}
                </Text>
                {director}
              </Text>
              <List.Section>
                <List.Accordion
                  title="Read more"
                  style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}
                  titleStyle={{ color: theme.iplayya.colors.strongpussy, marginLeft: -7 }}
                >
                  {readMoreData.map(({ key, label, value }) => {
                    return (
                      <List.Item
                        key={key}
                        titleStyle={{ marginBottom: -10 }}
                        title={
                          <Text style={{ ...createFontFormat(14, 20) }}>
                            <Text
                              style={{
                                color: theme.iplayya.colors.white50,
                                ...createFontFormat(14, 20)
                              }}
                            >
                              {label}
                              {': '}
                            </Text>
                            {value}
                          </Text>
                        }
                      />
                    );
                  })}
                </List.Accordion>
              </List.Section>
            </ContentWrap>

            {/* <PlayMovieButton setPaused={setPaused} />
            <PlayTrailerButton playTrailer={playTrailer} /> */}
          </ScrollView>

          {/* loader for download starting */}
          <Modal transparent visible={downloadsIsFetching}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.iplayya.colors.black50
              }}
            >
              <ActivityIndicator color={theme.iplayya.colors.vibrantpussy} />
            </View>
          </Modal>

          <SnackBar
            visible={showFavoriteSnackBar}
            message={`${title} is added to your favorites list`}
            iconName="heart-solid"
            iconColor={theme.iplayya.colors.vibrantpussy}
          />
          <SnackBar
            visible={showSnackbar}
            message="Downloading movie. You can check the progress in Downloaded section."
            iconName="download"
            iconColor={theme.iplayya.colors.vibrantpussy}
          />
        </React.Fragment>
      );
  };

  const setFullScreenPlayerStyle = () => {
    if (fullscreen)
      return {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      };

    return {};
  };

  /// MAIN
  return (
    <View style={{ flex: 1 }}>
      {renderStatusbar()}

      {/* Player */}
      <View style={{ ...setFullScreenPlayerStyle() }}>
        {renderMediaPlayer()}
        {renderVideoCaption()}
      </View>

      {/* content */}
      {renderScreenContent()}
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <MovieDetailScreen {...props} />
  </ScreenContainer>
);

const actions = {
  getMovieAction: Creators.getMovie,
  getMovieStartAction: Creators.getMovieStart,
  playbackStartAction: Creators.playbackStart,
  updatePlaybackInfoAction: Creators.updatePlaybackInfo,
  getFavoriteMoviesAction: Creators.getFavoriteMovies,
  addMovieToFavoritesStartAction: Creators.addMovieToFavoritesStart,
  downloadStartAction: DownloadsCreators.downloadStart,
  setMusicNowPlaying: MusicCreators.setNowPlaying
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  movie: selectMovie,
  videoSource: selectUrlForVodPlayer,
  playbackInfo: selectPlaybackInfo,
  isFavListUpdated: selectUpdatedFavoritesCheck,
  downloadsIsFetching: selectDownloading,
  downloadStarted: selectDownloadStarted,
  videoUrls: selectMovieVideoUrls,
  playbackSettings: selectPlaybackSettings
});

const enhance = compose(connect(mapStateToProps, actions), withNotifRedirect);

export default enhance(Container);
