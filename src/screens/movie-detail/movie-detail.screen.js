/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, Platform, Modal } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import MediaPlayer from 'components/media-player/media-player.component';
import { Text, List } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import withLoader from 'components/with-loader.component';
import { useTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/movies/movies.actions';
import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';
import { Creators as DownloadsCreators } from 'modules/ducks/downloads/downloads.actions';
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
} from 'modules/ducks/downloads/downloads.selectors';
import RNFetchBlob from 'rn-fetch-blob';
import { downloadPath, createFontFormat, toDateTime, toTitleCase } from 'utils';
import SnackBar from 'components/snackbar/snackbar.component';

import { useRemoteMediaClient } from 'react-native-google-cast';
import moment from 'moment';

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
  setMusicNowPlaying
}) => {
  const client = useRemoteMediaClient();

  const theme = useTheme();
  const [paused, setPaused] = React.useState(true);
  const [isMovieDownloaded, setIsMoviedownloaded] = React.useState(false);
  const [source, setSource] = React.useState('');
  const [downloadedFiles, setDownloadedFiles] = React.useState([]);
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  /// stop music player when a video is played
  React.useEffect(() => {
    if (!paused) {
      setMusicNowPlaying(null);
    }
  }, [paused]);

  React.useEffect(() => {
    listDownloadedFiles();
    downloadStartAction();
    playbackStartAction();
    getMovieStartAction();
    getMovieAction(videoId);
    addMovieToFavoritesStartAction();
  }, []);

  /// cast functions
  React.useEffect(() => {
    if (!client) return;
    // getChromecastStatus();

    if (paused) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [client, paused]);

  const handlePlay = async () => {
    await client.play();
  };

  const handlePause = async () => {
    await client.pause();
  };
  /// end cast functions

  // const getChromecastStatus = async () => {
  //   const chromecastStatus = await client.getMediaStatus();

  //   console.log({ chromecastStatus });
  // };

  React.useEffect(() => {
    if (showSnackbar) {
      hideSnackbar();
    }
  }, [showSnackbar]);

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
    }, 3000);
  };

  const listDownloadedFiles = async () => {
    const ls = await RNFetchBlob.fs.ls(downloadPath);
    setDownloadedFiles(ls);
  };

  React.useEffect(() => {
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

  if (!movie)
    return (
      <ContentWrap>
        <Text>Working...</Text>
      </ContentWrap>
    );

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

  // const timeToDate = toDateTime(otherFields.time * 60);
  // Object.assign(otherFields, {
  //   time: `${moment(timeToDate).format('H')}hr ${moment(timeToDate).format('mm')}m`
  // });

  console.log({ otherFields });

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

  const renderMediaPlayer = () => {
    if (!source)
      return (
        <View
          style={{
            flex: 1,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black'
          }}
        >
          <Text>NO SOURCE</Text>
        </View>
      );

    return (
      <MediaPlayer
        isSeries={is_series}
        paused={paused}
        source={source}
        thumbnail={thumbnail}
        title={title}
        togglePlay={handleTogglePlay}
        setPaused={setPaused}
        setSource={handleSourceSet}
        videoUrls={videoUrls}
        typename={movie.__typename}
      />
    );
  };

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      {/* Player */}
      <View>
        <Pressable
          onPress={() => handleTogglePlay()}
          style={{
            width: '100%',
            height: 211,
            marginBottom: 10,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {renderMediaPlayer()}
        </Pressable>
        <ContentWrap>
          <Text
            style={{
              ...createFontFormat(12, 16),
              color: theme.iplayya.colors.white50
            }}
          >{`${year}, 1h 55m | ${rating_mpaa}. ${category}`}</Text>
        </ContentWrap>
      </View>

      {/* <Button onPress={handleGooleCastPlay}>Play</Button>
      <Button onPress={handleGooleCastPause}>Pause</Button> */}

      {/* content */}
      <ScrollView style={{ height: 300 }}>
        <ContentWrap>
          <Text
            style={{ ...createFontFormat(24, 33), paddingVertical: 15 }}
          >{`${title} (${year})`}</Text>
          <Text style={{ ...createFontFormat(14, 20), marginBottom: 15 }}>{description}</Text>
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

          <Pressable style={styles.settingItem} onPress={() => setPaused(false)}>
            <View style={styles.iconContainer}>
              <Icon name="circular-play" size={24} />
            </View>
            <View>
              <Text style={{ ...createFontFormat(16, 22), fontWeight: 'bold' }}>Play movie</Text>
            </View>
          </Pressable>
          <Pressable style={styles.settingItem}>
            <View style={styles.iconContainer}>
              <Icon name="watch" size={24} />
            </View>
            <View>
              <Text style={{ ...createFontFormat(16, 22), fontWeight: 'bold' }}>Watch trailer</Text>
            </View>
          </Pressable>
        </ContentWrap>
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
        visible={showSnackbar}
        message="Downloading movie. You can check the progress in Downloaded section."
        iconName="download"
        iconColor={theme.iplayya.colors.vibrantpussy}
      />
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush backgroundType="solid">
    <MovieDetailScreen {...props} />
  </ScreenContainer>
);

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  iconContainer: {
    width: 42,
    justifyContent: 'center'
  },
  controls: {
    position: 'absolute'
  }
});

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
  videoUrls: selectMovieVideoUrls
});

const enhance = compose(connect(mapStateToProps, actions), withLoader);

export default enhance(Container);
