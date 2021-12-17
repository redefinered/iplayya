import React from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, Platform } from 'react-native';
import { withTheme } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import DeviceInfo from 'react-native-device-info';
import volumeThumbTransparent from 'assets/volume-thumb-transparent.png';
import VolumeContext from 'contexts/volume/volume.context';

const VolumeSlider = ({ theme, isFullscreen }) => {
  const { volume, setVolume } = React.useContext(VolumeContext);

  const getFullscreenStyle = () => {
    let WIDTH, TOP_OFFSET;

    const SLIDER_WIDTH = 5;
    const ROTATED_TOP_ZERO = 25 + SLIDER_WIDTH;
    const ROTATED_LEFT_ZERO = -25 - SLIDER_WIDTH;

    const V_SLIDER_MARGIN = 10;
    const NORMAL_SCREEN_VIDEO_HEIGHT = 211;

    const { width: SCREEN_WIDTH } = Dimensions.get('window');

    if (isFullscreen) {
      WIDTH = 200;

      const FULLSCREEN_ROTATED_LEFT_ZERO = -65;
      const FULLSCREEN_ROTATED_TOP_ZERO = 80;

      const SCREEN_WIDTH_DIVIDED_BY_TWO = SCREEN_WIDTH / 2;
      const WIDTH_WIDTH_DIVIDED_BY_TWO = WIDTH / 2;

      return {
        width: 200,
        top: FULLSCREEN_ROTATED_TOP_ZERO + SCREEN_WIDTH_DIVIDED_BY_TWO - WIDTH_WIDTH_DIVIDED_BY_TWO,
        left: DeviceInfo.hasNotch()
          ? FULLSCREEN_ROTATED_LEFT_ZERO + 30 + 4
          : FULLSCREEN_ROTATED_LEFT_ZERO
      };
    } else {
      WIDTH = Platform.OS === 'ios' ? 100 : 150;
      TOP_OFFSET = NORMAL_SCREEN_VIDEO_HEIGHT / 2; /// 15 is to nudge the slider a little up ward so it does not ovarlap with the volume button

      const OG_TOP_OFFSET = ROTATED_TOP_ZERO + TOP_OFFSET - WIDTH / 2;
      const HACK_OFFSET = OG_TOP_OFFSET + 40; // this is a temporary dix for volume positioning
      const OG_LEFT = ROTATED_LEFT_ZERO + V_SLIDER_MARGIN;
      const HACK_LEFT = OG_LEFT - 20; // this is a temporary dix for volume positioning

      return {
        width: WIDTH,
        top: Platform.OS === 'ios' ? OG_TOP_OFFSET : HACK_OFFSET,
        left: Platform.OS === 'ios' ? OG_LEFT : HACK_LEFT
      };
    }
  };

  return (
    <View
      style={{
        zIndex: 110,
        position: 'absolute',
        // backgroundColor: 'green',
        transform: [{ rotate: '-90deg' }],
        ...getFullscreenStyle()
      }}
    >
      <Slider
        thumbImage={volumeThumbTransparent}
        onValueChange={setVolume}
        value={volume}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor={theme.iplayya.colors.white100}
        maximumTrackTintColor={theme.iplayya.colors.white25}
      />
    </View>
  );
};

VolumeSlider.propTypes = {
  theme: PropTypes.object,
  isFullscreen: PropTypes.bool
};

export default withTheme(VolumeSlider);
