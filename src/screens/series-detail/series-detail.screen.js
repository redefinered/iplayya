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
  // selectUrlForVodPlayer
} from 'modules/ducks/movies/movies.selectors';
import {
  selectIsFetching as selectDownloading,
  selectDownloadStarted
} from 'modules/ducks/downloads/downloads.selectors';
import RNFetchBlob from 'rn-fetch-blob';
import { downloadPath, createFontFormat } from 'utils';
import SnackBar from 'components/snackbar/snackbar.component';
// import { data as dummydata } from './sample-video-series.json';

export const selectSource = (videourls) => {
  const urls = videourls.map(({ link }) => link);
  const mp4url = urls.find((url) => !url.includes('video.m3u8'));
  const m3u8url = urls.find((url) => url.includes('m3u8'));

  // return an empty string if
  if (typeof mp4url === 'undefined' && typeof m3u8url === 'undefined') return '';

  if (typeof m3u8url === 'undefined') return mp4url.split(' ')[1];

  return m3u8url.split(' ')[1];
};

const SeriesDetailScreen = ({
  theme,
  error,
  route: {
    params: { videoId }
  },
  movie: seriesdata,
  // videoSource,
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
  // const dummyvideo = dummydata.video;
  const [paused, setPaused] = React.useState(true);
  const [isDownloaded, setIsDownloaded] = React.useState(false);
  const [source, setSource] = React.useState('');
  const [downloadedFiles, setDownloadedFiles] = React.useState([]);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [videoUrls, setVideoUrls] = React.useState([]);
  const [season, setSeason] = React.useState(1);
  const [episode, setEpisode] = React.useState(1);
  const [isFirstEpisode, setIsFirstEpisode] = React.useState(true);
  const [isLastEpisode, setIsLastEpisode] = React.useState(false);
  const [seriesTitle, setSeriesTitle] = React.useState();

  React.useEffect(() => {
    listDownloadedFiles();
    downloadStartAction();
    playbackStartAction();
    getMovieStartAction();
    addMovieToFavoritesStartAction();

    // get movie series data
    getMovieAction(videoId);
    // getMovieAction(316); /// for testing
  }, []);

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

  const handleNextEpisode = () => {
    const { series } = seriesdata;
    const { episodes } = series.find(({ season: s }) => parseInt(s) === season);

    setIsFirstEpisode(false);

    /// total number of seasons
    const totalSeasons = series.length;
    /// total number of episodes of last season
    const totalEpisodesOfLastSeason = series[totalSeasons - 1].episodes.length;

    console.log({ totalSeasons, totalEpisodesOfLastSeason });

    const nextSeason = season + 1; // the supposed next season
    const nextEpisode = episode + 1; // the supposed next episode

    console.log({ season, episode, nextSeason, nextEpisode });

    if (episodes.length < nextEpisode) {
      /// cancel action if no episodes left
      if (nextSeason > totalSeasons && nextEpisode > episodes.length) return setIsLastEpisode(true);

      setSeason(season + 1);
      setEpisode(1);
      setIsLastEpisode(false);
      return;
    }

    setEpisode(episode + 1);
  };

  const handlePreviousEpisode = () => {
    setIsLastEpisode(false);

    const { series } = seriesdata;

    const prevSeason = season - 1; // the supposed previous season
    const prevEpisode = episode - 1; // the supposed previous episode

    console.log({ season, episode, prevSeason, prevEpisode });

    if (prevEpisode < 1) {
      /// cancel action if no episodes left
      if (prevSeason < 1 && prevEpisode < 1) return setIsFirstEpisode(true);

      const { episodes } = series.find(({ season: s }) => parseInt(s) === prevSeason);

      setSeason(season - 1);
      setEpisode(episodes.length);
      setIsFirstEpisode(false);
      return;
    }

    setEpisode(episode - 1);
  };

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
    if (seriesdata) {
      const titlesplit = seriesdata.title.split(' ');
      const title = titlesplit.join('_');
      const filename = `${videoId}_${title}.mp4`;
      const file = downloadedFiles.find((file) => file === filename);

      // check if downloaded
      if (downloadedFiles.length) {
        if (typeof file !== 'undefined') {
          setIsDownloaded(true);
        } else {
          setIsDownloaded(false);
        }
      }
    }
  }, [seriesdata, downloadedFiles]);

  React.useEffect(() => {
    if (seriesdata) {
      const { series } = seriesdata;

      /// set title
      setSeriesTitle(`S${season} E${episode}`);

      const { episodes } = series.find(({ season: s }) => parseInt(s) === season);

      const episodedata = episodes.find(({ episode: e }) => parseInt(e) === episode);
      console.log({ episodedata });

      setVideoUrls(episodedata.video_urls);

      const defaultSource = selectSource(episodedata.video_urls);

      const { title: movieTitle } = seriesdata;
      const titlesplit = movieTitle.split(' ');
      const title = titlesplit.join('_');
      const filename = `${videoId}_${title}.mp4`;

      // set source
      if (isDownloaded) {
        let src =
          Platform.OS === 'ios'
            ? `file://${downloadPath}/${filename}`
            : `${downloadPath}/${filename}`;
        setSource(src); /// file:// teqnique only works on iOS
      } else {
        // let src = videoUrl;
        // let setsrc = src === '' ? null : src;
        setSource(defaultSource);
      }
    }
  }, [seriesdata, isDownloaded, episode, season]);

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

  if (!seriesdata)
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
    ...otherFields
  } = seriesdata;

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
          {source !== '' ? (
            <MediaPlayer
              isSeries={is_series}
              paused={paused}
              source={source}
              thumbnail={thumbnail}
              title={title}
              seriesTitle={seriesTitle}
              togglePlay={handleTogglePlay}
              setPaused={setPaused}
              setSource={handleSourceSet}
              videoUrls={videoUrls}
              previousAction={handlePreviousEpisode}
              nextAction={handleNextEpisode}
              isFirstEpisode={isFirstEpisode}
              isLastEpisode={isLastEpisode}
            />
          ) : (
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
          )}
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
  // videoSource: selectUrlForVodPlayer,
  playbackInfo: selectPlaybackInfo,
  isFavListUpdated: selectUpdatedFavoritesCheck,
  downloadsIsFetching: selectDownloading,
  downloadStarted: selectDownloadStarted
});

const enhance = compose(
  connect(mapStateToProps, actions),
  withHeaderPush({ backgroundType: 'solid', withLoader: true }),
  withTheme
);

export default enhance(SeriesDetailScreen);
