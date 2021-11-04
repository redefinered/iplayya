/* eslint-disable react/prop-types */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  Modal,
  StatusBar,
  Dimensions
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import MediaPlayer from 'components/media-player/media-player.component';
import { Text, List } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import withLoader from 'components/with-loader.component';
import { withTheme } from 'react-native-paper';
import Icon from 'components/icon/icon.component';
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
  selectRemainingTime
} from 'modules/ducks/movies/movies.selectors';
import {
  selectIsFetching as selectDownloading,
  selectDownloadStarted
} from 'modules/ducks/imovie-downloads/imovie-downloads.selectors';
import { selectPlaybackSettings } from 'modules/ducks/user/user.selectors';
import RNFetchBlob from 'rn-fetch-blob';
import { downloadPath, createFontFormat } from 'utils';
import SnackBar from 'components/snackbar/snackbar.component';

import { useRemoteMediaClient } from 'react-native-google-cast';

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
  downloadStarted,

  setMusicNowPlaying,
  setEpisodeAction,
  navigation,

  remainingTime,
  playbackSettings,
  playbackInfo
}) => {
  // const dummyvideo = dummydata.video;
  const client = useRemoteMediaClient();

  const [paused, setPaused] = React.useState(false);
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
  const [fullscreen, setFullscreen] = React.useState(false);

  const renderStatusbar = () => {
    if (fullscreen) return <StatusBar hidden />;
  };
  /// stop music player when a video is played
  React.useEffect(() => {
    if (!paused) {
      setMusicNowPlaying(null);
    }
  }, [paused]);

  React.useEffect(() => {
    if (fullscreen) return navigation.setOptions({ headerShown: false });

    navigation.setOptions({ headerShown: true });
  }, [fullscreen]);

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
    if (playbackSettings.is_autoplay_video === false) {
      setPaused(!paused);
    }
  }, [playbackSettings.is_autoplay_video]);

  React.useEffect(() => {
    if (playbackInfo !== null) {
      if (remainingTime.toFixed() == 0) {
        if (playbackSettings.is_autoplay_next_ep === true) {
          handleNextEpisode();
        } else {
          return;
        }
      }
    }
  }, [playbackInfo]);

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

  // const getChromecastStatus = async () => {
  //   const chromecastStatus = await client.getMediaStatus();

  //   console.log({ chromecastStatus });
  // };
  /// end cast functions

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

  const handleSourceSet = React.useCallback((src) => {
    setSource(src);
  }, []);

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
      console.log({ seriesdata });
      const episodetitle = `${seriesdata.title} SO${season}E${episode}`;
      const titlesplit = episodetitle.split(' ');
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
  }, [seriesdata, downloadedFiles, episode, season]);

  React.useEffect(() => {
    if (seriesdata) {
      const { series } = seriesdata;

      if (!series) return;

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

      /// set episode in reducer state
      setEpisodeAction(season, episode);
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

  const handleEpisodeSelect = (data) => {
    const { season, episode } = data;

    setSeason(parseInt(season));
    setEpisode(parseInt(episode));
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
    series,
    ...otherFields
  } = seriesdata;

  if (!series)
    return (
      <ContentWrap>
        <Text>Working...</Text>
      </ContentWrap>
    );

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
        isSeries={true}
        multipleMedia={true}
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
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
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
                  <Icon name="circular-play" size={theme.iconSize(3)} />
                </View>
                <View>
                  <Text style={{ ...createFontFormat(16, 22), fontWeight: 'bold' }}>
                    Play movie
                  </Text>
                </View>
              </Pressable>
              <Pressable style={styles.settingItem}>
                <View style={styles.iconContainer}>
                  <Icon name="watch" size={theme.iconSize(3)} />
                </View>
                <View>
                  <Text style={{ ...createFontFormat(16, 22), fontWeight: 'bold' }}>
                    Watch trailer
                  </Text>
                </View>
              </Pressable>
            </ContentWrap>

            <ContentWrap style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(6) }}>
              {series.map(({ season }, index) => {
                const { episodes } = series[index];
                return (
                  <List.Accordion
                    key={index}
                    title={`Season ${season}`}
                    style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}
                    titleStyle={{ color: theme.iplayya.colors.strongpussy, marginLeft: -7 }}
                  >
                    {episodes.map(({ episode }, index) => {
                      return (
                        <List.Item
                          key={index}
                          onPress={() => handleEpisodeSelect({ season, episode })}
                          titleStyle={{ marginBottom: -10 }}
                          title={
                            <Text
                              style={{ ...createFontFormat(14, 20) }}
                            >{`Episode ${episode}`}</Text>
                          }
                        />
                      );
                    })}
                  </List.Accordion>
                );
              })}
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
  <ScreenContainer withHeaderPush backgroundType="solid">
    <SeriesDetailScreen {...props} />
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
  setEpisodeAction: Creators.setEpisode,
  setMusicNowPlaying: MusicCreators.setNowPlaying
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  isFetching: selectIsFetching,
  movie: selectMovie,
  playbackInfo: selectPlaybackInfo,
  isFavListUpdated: selectUpdatedFavoritesCheck,
  downloadsIsFetching: selectDownloading,
  downloadStarted: selectDownloadStarted,
  remainingTime: selectRemainingTime,
  playbackSettings: selectPlaybackSettings
});

const enhance = compose(connect(mapStateToProps, actions), withTheme, withLoader);

export default enhance(Container);
