/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import Video from 'react-native-video';
import VideoControls from 'components/video-controls/video-controls.component';

import { connect } from 'react-redux';
import { Creators as MoviesActionCreators } from 'modules/ducks/movies/movies.actions';

import { urlEncodeTitle } from 'utils';

const MediaPlayer = ({
  updatePlaybackInfoAction,
  source,
  thumbnail,
  title,
  paused,
  togglePlay
}) => {
  const [showControls, setShowControls] = React.useState(true);
  const [fullscreen, setFullscreen] = React.useState(false);

  let timer = null;

  let player = React.useRef(null);

  const handleFullscreenToggle = () => {
    setFullscreen(!fullscreen);
  };

  const onBuffer = () => {
    console.log('buffer callback');
  };

  const videoError = () => {
    console.log('video error');
  };

  const handleProgress = (playbackInfo) => {
    updatePlaybackInfoAction({ playbackInfo });
  };

  const hideControls = (duration = 5) => {
    return setTimeout(() => {
      setShowControls(false);
    }, duration * 1000);
  };

  React.useEffect(() => {
    if (paused) {
      clearTimeout(timer);
      setShowControls(true);
    } else {
      timer = hideControls(10);
    }
  }, [paused]);

  return (
    <React.Fragment>
      <Video
        paused={paused}
        fullscreen={fullscreen}
        onProgress={handleProgress}
        // controls
        fullscreenOrientation="landscape"
        source={{ uri: source }}
        ref={player}
        onBuffer={() => onBuffer()}
        onError={() => videoError()}
        poster={
          thumbnail === 'N/A' || thumbnail === ''
            ? `https://via.placeholder.com/336x190.png?text=${urlEncodeTitle(title)}`
            : thumbnail
        }
        style={{ width: Dimensions.get('window').width, height: 211, backgroundColor: 'black' }}
      />
      <VideoControls
        title={title}
        togglePlay={togglePlay}
        paused={paused}
        toggleFullscreen={handleFullscreenToggle}
        style={{ position: 'absolute' }}
        visible={showControls}
      />
    </React.Fragment>
  );
};

MediaPlayer.propTypes = {
  title: PropTypes.string,
  source: PropTypes.string,
  thumbnail: PropTypes.string,
  paused: PropTypes.bool,
  togglePlay: PropTypes.func,
  updatePlaybackInfoAction: PropTypes.func
};

const actions = {
  updatePlaybackInfoAction: MoviesActionCreators.updatePlaybackInfo
};

export default connect(null, actions)(MediaPlayer);
