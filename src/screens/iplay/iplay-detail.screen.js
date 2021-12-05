import React from 'react';
import PropTypes from 'prop-types';
import { View, StatusBar } from 'react-native';
import ScreenContainer from 'components/screen-container.component';
import MediaPlayer from 'components/media-player/media-player.component';
import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withNotifRedirect from 'components/with-notif-redirect.component';

// eslint-disable-next-line react/prop-types
const IplayDetailScreen = ({ navigation, route, setMusicNowPlaying }) => {
  const { file } = route.params;
  const [fullscreen, setFullscreen] = React.useState(false);
  const [paused, setPaused] = React.useState(false);

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
    }
  }, [paused]);

  const handleTogglePlay = () => {
    setPaused(!paused);
  };

  const { name, fileCopyUri } = file;

  const renderMediaPlayer = () => {
    return (
      <MediaPlayer
        containerStyle={{ backgroundColor: 'red' }}
        paused={paused}
        source={fileCopyUri}
        title={name}
        togglePlay={handleTogglePlay}
        setPaused={setPaused}
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
      />
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

      <View style={{ ...setFullScreenPlayerStyle() }}>{renderMediaPlayer()}</View>
    </View>
  );
};

IplayDetailScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object
};

const Container = (props) => (
  <ScreenContainer withHeaderPush>
    <IplayDetailScreen {...props} />
  </ScreenContainer>
);

const actions = {
  setMusicNowPlaying: MusicCreators.setNowPlaying
};

const enhance = compose(connect(null, actions), withNotifRedirect);

// export default IplayDetailScreen;
export default enhance(Container);
