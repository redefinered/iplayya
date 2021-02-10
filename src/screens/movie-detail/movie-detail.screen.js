/* eslint-disable react/prop-types */

import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
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
import { createStructuredSelector } from 'reselect';
import {
  selectError,
  selectIsFetching,
  selectMovie,
  selectPlaybackInfo,
  selectUpdatedFavoritesCheck
} from 'modules/ducks/movies/movies.selectors';
import { createFontFormat } from 'utils';
import RNFetchBlob from 'rn-fetch-blob';

const dirs = RNFetchBlob.fs.dirs;

const MovieDetailScreen = ({
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
  addMovieToFavoritesStartAction
}) => {
  // console.log({ isDownloaded });
  const [paused, setPaused] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [isMovieDownloaded, setIsMoviedownloaded] = React.useState(false);
  const [source, setSource] = React.useState('');
  const [downloadedFiles, setDownloadedFiles] = React.useState([]);

  const listDownloadedFiles = async () => {
    const ls = await RNFetchBlob.fs.ls(dirs.DocumentDir);
    setDownloadedFiles(ls);
    // console.log({ ls });
  };

  React.useEffect(() => {
    if (movie) {
      const titlesplit = movie.title.split(' ');
      const title = titlesplit.join('_');
      const filename = `${videoId}_${title}.mp4`;
      const file = downloadedFiles.find((file) => file === filename);
      // set source
      // setSource(movie.rtsp_url.split(' ')[1]);

      // check if downloaded
      if (downloadedFiles.length) {
        if (typeof file !== 'undefined') {
          setIsMoviedownloaded(true);
        } else {
          setIsMoviedownloaded(false);
        }
      }

      // set source
      if (isMovieDownloaded) {
        if (typeof file !== 'undefined') {
          setSource(`${dirs.DocumentDir}/${filename}`);
        } else {
          setSource(rtsp_url.split(' ')[1]);
        }
      }
    }
  }, [movie, downloadedFiles, isMovieDownloaded]);

  React.useEffect(() => {
    listDownloadedFiles();
  }, []);

  // // set source
  // React.useEffect(() => {
  //   const titlesplit = movie.title.split(' ');
  //   const title = titlesplit.join('_');
  //   const filename = `${videoId}_${title}.mp4`;
  //   const file = downloadedFiles.find((file) => file === filename);

  // }, [isMovieDownloaded]);

  console.log({ isMovieDownloaded });

  // execute getFavorites if favorites list is updated
  React.useEffect(() => {
    if (isFavListUpdated) {
      getFavoriteMoviesAction();
    }
  }, [isFavListUpdated]);

  React.useEffect(() => {
    addMovieToFavoritesStartAction();
  }, []);

  React.useEffect(() => {
    playbackStartAction();
    getMovieStartAction();
    getMovieAction(videoId);
  }, []);

  const handleTogglePlay = () => {
    setLoading(true);
    setPaused(!paused);
  };

  if (!movie)
    return (
      <ContentWrap>
        <Text>Wait lang beh...</Text>
      </ContentWrap>
    );

  const {
    title,
    year,
    description,
    rating_mpaa,
    category,
    director,
    rtsp_url,
    thumbnail,
    ...otherFields
  } = movie;

  // console.log({ rtsp_url, playbackInfo });

  // const handleDownloadMovie = () => {
  //   RNFetchBlob.config({
  //     // add this option that makes response data to be stored as a file,
  //     // this is much more performant.
  //     fileCache: true
  //   })
  //     .fetch('GET', rtsp_url.split(' ')[1], {
  //       //some headers ..
  //     })
  //     .then((res) => {
  //       // the temp file path
  //       console.log('The file saved to ', res.path());
  //     });
  // };

  // console.log({ source });

  const renderPlayer = () => {
    if (source) {
      return (
        <MediaPlayer
          paused={paused}
          // source={rtsp_url.split(' ')[1]}
          // source={`${dirs.DocumentDir}/12_Angry_Men.mp4`}
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
              {Object.keys(otherFields).map((key) => (
                <List.Item
                  key={key}
                  titleStyle={{ marginBottom: -10 }}
                  title={
                    <Text style={{ ...createFontFormat(14, 20) }}>
                      <Text
                        style={{ color: theme.iplayya.colors.white50, ...createFontFormat(14, 20) }}
                      >
                        {key}{' '}
                      </Text>
                      {otherFields[key]}
                    </Text>
                  }
                />
              ))}
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
  addMovieToFavoritesStartAction: Creators.addMovieToFavoritesStart
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  movie: selectMovie,
  playbackInfo: selectPlaybackInfo,
  isFavListUpdated: selectUpdatedFavoritesCheck
});

export default compose(
  withHeaderPush(),
  connect(mapStateToProps, actions),
  withLoader,
  withTheme
)(MovieDetailScreen);