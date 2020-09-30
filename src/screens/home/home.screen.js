import React from 'react';
import PropTypes from 'prop-types';
import { Text, SafeAreaView, Dimensions } from 'react-native';
import OnBoarding from 'screens/onboarding/onboarding.screen';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser, selectPortalAddress } from 'modules/ducks/auth/auth.selectors';

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
    const { portalAddress } = this.props;
    if (portalAddress) {
      return (
        <SafeAreaView>
          <Text>Video</Text>
          <Video
            controls={true}
            fullscreen
            source={{ uri: 'http://37.187.174.33:2080/914/video.m3u8' }} // Can be a URL or a local file.
            ref={(ref) => {
              this.player = ref;
            }} // Store reference
            onBuffer={this.handleVideoError} // Callback when remote video is buffering
            onError={this.handleVideoBuffering} // Callback when video cannot be loaded
            style={{ width: Dimensions.get('window').width, height: 200, backgroundColor: 'black' }}
          />
        </SafeAreaView>
      );
    } else {
      return <OnBoarding />;
    }
  }
}

Home.propTypes = {
  currentUser: PropTypes.object,
  portalAddress: PropTypes.string,
  helloAction: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  portalAddress: selectPortalAddress
});

export default connect(mapStateToProps)(Home);
