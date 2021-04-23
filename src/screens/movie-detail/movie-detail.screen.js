/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, Platform, Modal } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import MediaPlayer from 'components/media-player/media-player.component';
import { Text, List } from 'react-native-paper';
import withHeaderPush from 'components/with-header-push/with-header-push.component';
import { withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
import withLoader from 'components/with-loader.component';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/movies/movies.actions';
import { Creators as DownloadsCreators } from 'modules/ducks/downloads/downloads.actions';
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectMovie,
  selectPlaybackInfo,
  selectUpdatedFavoritesCheck
} from 'modules/ducks/movies/movies.selectors';
import {
  selectIsFetching as selectDownloading,
  selectDownloadStarted
} from 'modules/ducks/downloads/downloads.selectors';
import RNFetchBlob from 'rn-fetch-blob';
import { downloadPath, createFontFormat } from 'utils';
import SnackBar from 'components/snackbar/snackbar.component';

const MovieDetailScreen = ({
  error,
  route: {
    params: { videoId }
  },
  movie,
  theme,
  playbackStartAction,
  getMovieAction,
  getMovieStartAction,
  isFavListUpdated,
  getFavoriteMoviesAction,
  addMovieToFavoritesStartAction,

  downloadsIsFetching,
  downloadStartAction,
  downloadStarted
}) => {
  // console.log({ isDownloaded });
  const [paused, setPaused] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [isMovieDownloaded, setIsMoviedownloaded] = React.useState(false);
  const [source, setSource] = React.useState(null);
  const [downloadedFiles, setDownloadedFiles] = React.useState([]);
  const [showSnackbar, setShowSnackbar] = React.useState(false);

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
  }, [movie, downloadedFiles, isMovieDownloaded]);

  React.useEffect(() => {
    if (movie) {
      const { is_series } = movie;
      let videoUrl = '';
      if (is_series) {
        /// for testing
        videoUrl = 'xxx http://84.17.37.2/boxoffice/1080p/GodzillaVsKong-2021-1080p.mp4/index.m3u8';
      } else {
        const { video_urls } = movie;
        videoUrl = video_urls[0].link;
      }
      const { title: movieTitle } = movie;
      // const { link: videoUrl } = video_urls[0];
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
        let src = videoUrl.split(' ')[1];
        let setsrc = typeof src === 'undefined' ? null : src;
        setSource(setsrc);
      }
    }
  }, [movie, isMovieDownloaded]);

  React.useEffect(() => {
    listDownloadedFiles();
    downloadStartAction();
  }, []);

  // execute getFavorites if favorites list is updated
  React.useEffect(() => {
    if (isFavListUpdated) {
      getFavoriteMoviesAction();
    }
  }, [isFavListUpdated]);

  React.useEffect(() => {
    playbackStartAction();
    getMovieStartAction();
    getMovieAction(videoId);
    addMovieToFavoritesStartAction();
  }, []);

  const handleTogglePlay = () => {
    setLoading(true);
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
    title,
    year,
    description,
    rating_mpaa,
    category,
    director,
    thumbnail,
    is_series,
    series,
    video_urls,
    ...otherFields
  } = movie;

  const renderPlayer = () => {
    if (source) {
      return (
        <MediaPlayer
          isSeries={movie.is_series}
          paused={paused}
          source={source}
          thumbnail={thumbnail}
          title={title}
          togglePlay={handleTogglePlay}
          loading={loading}
          setLoading={setLoading}
        />
      );
    }
  };

  console.log({ downloadStarted });
  return (
    <View>
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
          {renderPlayer()}
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

      {/* content */}
      <ScrollView style={{ height: 300 }}>
        <ContentWrap>
          {/* <Pressable onPress={() => toggleControlVisible()}>
            <Text>toggle control</Text>
          </Pressable> */}
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
              {Object.keys(otherFields).map((key) => {
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
                          {key}{' '}
                        </Text>
                        {otherFields[key]}
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
          <ActivityIndicator size="large" color={theme.iplayya.colors.vibrantpussy} />
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
  downloadStartAction: DownloadsCreators.downloadStart
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  movie: selectMovie,
  playbackInfo: selectPlaybackInfo,
  isFavListUpdated: selectUpdatedFavoritesCheck,
  downloadsIsFetching: selectDownloading,
  downloadStarted: selectDownloadStarted
});

export default compose(
  withHeaderPush({ backgroundType: 'solid' }),
  connect(mapStateToProps, actions),
  withLoader,
  withTheme
)(MovieDetailScreen);
