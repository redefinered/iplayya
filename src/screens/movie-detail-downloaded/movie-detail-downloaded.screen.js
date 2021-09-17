/* eslint-disable react/prop-types */
import React from 'react';
import { View, ScrollView, Dimensions, StatusBar, Platform, Modal } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import ContentWrap from 'components/content-wrap.component';
import MediaPlayer from 'components/media-player/media-player.component';
import { Text, List } from 'react-native-paper';
import ScreenContainer from 'components/screen-container.component';
import { withTheme } from 'react-native-paper';
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
  selectUpdatedFavoritesCheck,
  selectUrlForVodPlayer,
  selectMovieVideoUrls
} from 'modules/ducks/movies/movies.selectors';
import {
  selectIsFetching as selectDownloading,
  selectDownloadStarted
} from 'modules/ducks/downloads/downloads.selectors';
import { downloadPath, createFontFormat } from 'utils';
import SnackBar from 'components/snackbar/snackbar.component';
import withLoader from 'components/with-loader.component';

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

  videoUrls
}) => {
  const [paused, setPaused] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isMovieDownloaded] = React.useState(true);
  const [source, setSource] = React.useState('');
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);

  const renderStatusbar = () => {
    if (fullscreen) return <StatusBar hidden />;
  };

  React.useEffect(() => {
    if (fullscreen) return navigation.setOptions({ headerShown: false });

    navigation.setOptions({ headerShown: true });
  }, [fullscreen]);

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
    year,
    description,
    rating_mpaa,
    category,
    director,
    thumbnail,
    is_series,
    ...otherFields
  } = movie;

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

  console.log({ xxx: source });

  const renderScreenContent = () => {
    if (fullscreen) return;

    return (
      <React.Fragment>
        {/* content */}
        <ScrollView style={{ height: 300 }}>
          <ContentWrap>
            {/* <Pressable onPress={() => toggleControlVisible()}>
            <Text>toggle control</Text>
          </Pressable> */}
            <Text style={{ ...createFontFormat(24, 33), paddingVertical: 15 }}>{title}</Text>
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

  return (
    <View style={{ flex: 1 }}>
      {renderStatusbar()}

      {/* Player */}
      <View style={{ ...setFullScreenPlayerStyle() }}>
        {renderMediaPlayer()}
        {renderVideoCaption()}
      </View>

      {/* Player */}
      {/* <View>
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
              togglePlay={handleTogglePlay}
              setPaused={setPaused}
              loading={loading}
              videoUrls={videoUrls}
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
      </View> */}

      {renderScreenContent()}
    </View>
  );
};

const Container = (props) => (
  <ScreenContainer withHeaderPush backgroundType="solid">
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
  downloadStartAction: DownloadsCreators.downloadStart
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

const enhance = compose(connect(mapStateToProps, actions), withTheme, withLoader);

export default enhance(Container);
