/* eslint-disable react/prop-types */
import React from 'react';
import { View, ScrollView, Dimensions, StatusBar, Platform, Modal } from 'react-native';
import { ActivityIndicator, TouchableRipple } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import MediaPlayer from 'components/media-player/media-player.component';
import { Text, List } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import { withTheme } from 'react-native-paper';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Creators } from 'modules/ducks/movies/movies.actions';
import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';
import { Creators as RadioCreators } from 'modules/ducks/iradio/iradio.actions';
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
import { downloadPath, createFontFormat, toDateTime, toTitleCase } from 'utils';
import SnackBar from 'components/snackbar/snackbar.component';
import withNotifRedirect from 'components/with-notif-redirect.component';
import Icon from 'components/icon/icon.component';
import moment from 'moment';

const MovieDetailScreen = ({
  navigation,

  theme,
  error,
  route: {
    params: { movie }
  },
  isFavListUpdated,
  getFavoriteMoviesAction,
  downloadsIsFetching,
  downloadStarted,

  videoUrls,
  setMusicNowPlaying,
  setRadioNowPlaying
}) => {
  const [paused, setPaused] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isMovieDownloaded] = React.useState(true);
  const [source, setSource] = React.useState('');
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [showMore, setShowMore] = React.useState(false);

  const renderStatusbar = () => {
    if (fullscreen) return <StatusBar hidden />;
  };

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

  const handleShowMore = () => {
    if (showMore === false) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
  };

  React.useEffect(() => {
    if (movie) {
      const { title: movieTitle } = movie;
      const titlesplit = movieTitle.split(' ');
      const title = titlesplit.join('_');
      const filename = is_series
        ? `${movie.id}${movie.ep}_${title}.mp4`
        : `${movie.id}_${title}.mp4`;

      let src =
        Platform.OS === 'ios'
          ? `file://${downloadPath}/${filename}`
          : `${downloadPath}/${filename}`;

      setSource(src); /// file://

      /// set title
      const { title: movietitle, ep } = movie;
      const t = ep ? `${movietitle} ${ep}` : movietitle;
      setTitle(t);
    }
  }, [movie, isMovieDownloaded]);

  // execute getFavorites if favorites list is updated
  React.useEffect(() => {
    if (isFavListUpdated) {
      getFavoriteMoviesAction();
    }
  }, [isFavListUpdated]);

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

  /// render a ghost view if movie is null. that's right, hacker!!!
  if (!movie) return <View />;

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
    // eslint-disable-next-line no-unused-vars
    ep,

    year,
    description,
    rating_mpaa,
    category,
    thumbnail,
    is_series,
    ...otherFields
  } = movie;

  const readMoreData = Object.keys(otherFields).map((key) => {
    if (key === 'director') {
      return {
        key,
        label: 'Director',
        value: otherFields[key]
      };
    }

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
            width: Dimensions.get('window').width,
            height: 211,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            marginBottom: theme.spacing(1)
          }}
        />
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
        loading={loading}
        videoUrls={videoUrls}
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
      />
    );
  };

  const renderVideoCaption = () => {
    if (!fullscreen)
      return (
        <ContentWrap style={{ marginTop: theme.spacing(2) }}>
          <Text
            style={{
              ...createFontFormat(12, 16),
              color: theme.iplayya.colors.white50,
              marginTop: theme.spacing(2)
            }}
          >{`${year}, 1h 55m | ${rating_mpaa}. ${category}`}</Text>
        </ContentWrap>
      );
  };

  console.log({ xxx: source });

  const renderScreenContent = () => {
    if (fullscreen) return;

    return (
      <React.Fragment>
        {/* content */}
        <ContentWrap>
          <Text
            style={{ ...createFontFormat(24, 33), paddingVertical: 15 }}
          >{`${title} (${year})`}</Text>
        </ContentWrap>
        <ScrollView>
          <ContentWrap>
            <Text numberOfLines={showMore ? null : 4} style={{ ...createFontFormat(14, 20) }}>
              {description}
            </Text>
          </ContentWrap>
          {showMore ? (
            <View style={{ marginBottom: theme.spacing(3) }}>
              {readMoreData.map(({ key, label, value }) => {
                return (
                  <List.Item
                    key={key}
                    titleStyle={{ marginBottom: theme.spacing(-4) }}
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
            </View>
          ) : null}
          <TouchableRipple onPress={handleShowMore} rippleColor={theme.iplayya.colors.white25}>
            <ContentWrap>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: theme.spacing(2)
                }}
              >
                <Text
                  style={{
                    color: theme.iplayya.colors.strongpussy,
                    ...createFontFormat(14, 20)
                  }}
                >
                  {showMore ? 'Read Less' : 'Read More'}
                </Text>
                <Icon
                  name={showMore ? 'caret-up' : 'caret-down'}
                  size={theme.iconSize(3)}
                  style={{
                    color: theme.iplayya.colors.white80,
                    marginRight: theme.spacing(1)
                  }}
                />
              </View>
            </ContentWrap>
          </TouchableRipple>
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

    return {
      marginTop: fullscreen ? 0 : theme.spacing(2),
      marginBottom: fullscreen ? 0 : theme.spacing(2)
    };
  };

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
  setMusicNowPlaying: MusicCreators.setNowPlaying,
  setRadioNowPlaying: RadioCreators.setNowPlaying
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

const enhance = compose(connect(mapStateToProps, actions), withTheme, withNotifRedirect);

export default enhance(Container);
