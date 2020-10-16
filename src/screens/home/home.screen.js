/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import ContentWrap from 'components/content-wrap.component';
import withHeaderPush from 'components/with-header-push/with-header-push.component';

import HomeMenu from 'components/home-menu/home-menu.component';

// const VideoX = () => (
//   <Video
//     fullscreen
//     controls
//     source={{
//       type,
//       uri: 'http://37.187.174.33:2080/100/video.m3u8?token=01f6f6da00daeb6bc97042135e966b43'
//     }}
//     ref={(ref) => {
//       this.player = ref;
//     }} // Store reference
//     onBuffer={this.handleVideoBuffering} // Callback when remote video is buffering
//     onError={this.handleVideoError} // Callback when video cannot be loaded
//     style={{
//       width: Dimensions.get('window').width,
//       height: 200,
//       backgroundColor: 'black'
//     }}
//   />
// );

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      videoError: null,
      videoBuffering: false,
      iconSize: 15
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
    // const { iconSize } = this.state;
    // console.log(Math.ceil(iconSize));
    // const channels = [
    //   { name: 'ESPN', uri: 'http://195.181.160.220:2080/9/video.m3u8' },
    //   { name: 'Avengers', uri: 'http://195.181.160.220:2080/9/video.m3u8' },
    //   { name: 'Startrek', uri: 'http://89.187.191.201/1492026922/StarTrek.mp4' },
    //   { name: 'xxx', url: 'http://37.187.174.33:2080/1/video.m3u8' }
    // ];
    // const type = 'm3u8';

    return (
      <ContentWrap>
        <HomeMenu />
      </ContentWrap>
    );
  }
}

Home.propTypes = {
  currentUser: PropTypes.object,
  portalAddress: PropTypes.string,
  helloAction: PropTypes.func
};

export default withHeaderPush(Home, { backgroundType: 'image' });
