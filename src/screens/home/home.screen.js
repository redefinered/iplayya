import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, Dimensions } from 'react-native';

import Video from 'react-native-video';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoError: null,
      videoBuffering: false
    };
  }

  handleVideoError = () => {
    // this.setState({ videoError: 'Error loading the video' });
    console.log('Error loading the video');
  };

  handleVideoBuffering = () => {
    // this.setState({ videoBuffering: true });
    console.log('buffering...');
  };

  render() {
    const channels = [
      { name: 'ESPN', uri: 'http://195.181.160.220:2080/12/video.m3u8' },
      { name: 'xxx', url: 'http://37.187.174.33:2080/1/video.m3u8' }
    ];
    const type = 'm3u8';

    return (
      <SafeAreaView>
        <Video
          fullscreen
          controls
          source={{ type, uri: channels[0].uri }}
          ref={(ref) => {
            this.player = ref;
          }} // Store reference
          onBuffer={this.handleVideoBuffering} // Callback when remote video is buffering
          onError={this.handleVideoError} // Callback when video cannot be loaded
          style={{
            width: Dimensions.get('window').width,
            height: 200,
            backgroundColor: 'black'
          }}
        />
      </SafeAreaView>
    );
  }
}

Home.propTypes = {
  currentUser: PropTypes.object,
  portalAddress: PropTypes.string,
  helloAction: PropTypes.func
};

export default Home;
