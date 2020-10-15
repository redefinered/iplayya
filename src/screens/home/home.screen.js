/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, Dimensions, View, ScrollView, StyleSheet } from 'react-native';

// import Video from 'react-native-video';
import Slider from '@react-native-community/slider';

import Icon from 'components/icon/icon.component';
import mapx from 'components/icon/fonts-map';
import Button from 'components/button/button.component';
import ContentWrap from 'components/content-wrap.component';

console.log({ mapx });

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
    const { iconSize } = this.state;
    // console.log(Math.ceil(iconSize));
    // const channels = [
    //   { name: 'ESPN', uri: 'http://195.181.160.220:2080/9/video.m3u8' },
    //   { name: 'Avengers', uri: 'http://195.181.160.220:2080/9/video.m3u8' },
    //   { name: 'Startrek', uri: 'http://89.187.191.201/1492026922/StarTrek.mp4' },
    //   { name: 'xxx', url: 'http://37.187.174.33:2080/1/video.m3u8' }
    // ];
    // const type = 'm3u8';

    return (
      <SafeAreaView>
        <ContentWrap>
          <Slider
            style={{ width: Dimensions.get('window').width - 30, height: 40 }}
            onValueChange={(iconSize) => this.setState({ iconSize })}
            minimumValue={15}
            maximumValue={100}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
          />
          <ScrollView>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {Object.keys(mapx).map((key) => (
                <Icon key={key} name={key} style={styles.icon} size={iconSize} />
              ))}
            </View>
          </ScrollView>
          <Button
            style={{ marginTop: 30 }}
            mode="contained"
            onPress={() => {
              this.props.navigation.navigate('ForgotPasswordScreen');
            }}
          >
            Click
          </Button>
        </ContentWrap>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    color: 'red',
    margin: 5
  }
});

Home.propTypes = {
  currentUser: PropTypes.object,
  portalAddress: PropTypes.string,
  helloAction: PropTypes.func
};

export default Home;
