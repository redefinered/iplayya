import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import Video from 'react-native-video';
import VideoControls from 'components/video-controls/video-controls.component';

import { connect } from 'react-redux';
import { Creators as MovieActionCreators } from 'modules/ducks/movie/movie.actions';

import { urlEncodeTitle } from 'utils';

const VideoPlayer = ({
  updatePlaybackInfoAction,
  source,
  thumbnail,
  title,
  paused,
  togglePlay
}) => {
  const [showControls, setShowControls] = React.useState(true);
  const [fullscreen, setFullscreen] = React.useState(false);

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
    // console.log({ playbackInfo });
    setShowControls(false);
    updatePlaybackInfoAction({ playbackInfo });
  };

  // const toggleControlVisible = () => {
  //   setShowControls(!showControls);
  // };

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
        paused={paused}
        togglePlay={togglePlay}
        toggleFullscreen={handleFullscreenToggle}
        style={{ position: 'absolute' }}
        visible={showControls}
      />
    </React.Fragment>
  );
};

VideoPlayer.propTypes = {
  title: PropTypes.string,
  source: PropTypes.string,
  thumbnail: PropTypes.string,
  paused: PropTypes.bool,
  togglePlay: PropTypes.func,
  updatePlaybackInfoAction: PropTypes.func
};

const actions = {
  updatePlaybackInfoAction: MovieActionCreators.updatePlaybackInfo
};

export default connect(null, actions)(VideoPlayer);
